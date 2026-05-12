import * as vscode from 'vscode';
import { createHash, randomBytes, randomUUID } from 'crypto';

type RandomCharset = 'alphanumeric' | 'letters' | 'numbers' | 'hex' | 'base64url' | 'symbols' | 'safePassword' | 'custom';

interface GeneratorConfig {
    defaultLength: number;
    passwordLength: number;
    slugWords: number;
    copyToClipboard: boolean;
    showSuccessMessage: boolean;
}

const CHARSETS: Record<Exclude<RandomCharset, 'custom'>, string> = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    hex: '0123456789abcdef',
    base64url: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
    safePassword: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+[]{}'
};

const SLUG_WORDS = [
    'amber', 'archer', 'aurora', 'binary', 'cipher', 'comet', 'crystal', 'dragon', 'ember', 'forest',
    'forge', 'frost', 'galaxy', 'harbor', 'hunter', 'ion', 'lunar', 'matrix', 'meadow', 'nova',
    'onyx', 'pixel', 'quartz', 'ranger', 'raven', 'rocket', 'shadow', 'signal', 'silver', 'storm',
    'summit', 'titan', 'vector', 'velvet', 'vortex', 'wizard', 'zenith'
];

export function activate(context: vscode.ExtensionContext): void {
    const registrations: Array<[string, () => Promise<string | undefined> | string | undefined]> = [
        ['generateString.guid', () => randomUUID()],
        ['generateString.uuidUppercase', () => randomUUID().toUpperCase()],
        ['generateString.uuidNoDashes', () => randomUUID().replace(/-/g, '')],
        ['generateString.randomHex32', () => randomHex(32)],
        ['generateString.randomHex64', () => randomHex(64)],
        ['generateString.randomBase64', () => randomBase64(32)],
        ['generateString.randomBase64Url', () => randomBase64Url(32)],
        ['generateString.randomAlphaNumeric', () => randomString(getConfig().defaultLength, 'alphanumeric')],
        ['generateString.randomPassword', () => randomString(getConfig().passwordLength, 'safePassword')],
        ['generateString.nanoId', () => randomString(21, 'base64url')],
        ['generateString.md5', () => randomHash('md5')],
        ['generateString.sha1', () => randomHash('sha1')],
        ['generateString.sha256', () => randomHash('sha256')],
        ['generateString.sha384', () => randomHash('sha384')],
        ['generateString.sha512', () => randomHash('sha512')],
        ['generateString.slug', () => randomSlug(getConfig().slugWords)],
        ['generateString.timestampUnix', () => Math.floor(Date.now() / 1000).toString()],
        ['generateString.timestampIso', () => new Date().toISOString()],
        ['generateString.custom', generateCustomString]
    ];

    for (const [command, factory] of registrations) {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, async () => {
                const value = await factory();
                if (!value) {
                    return;
                }
                await insertGeneratedValue(value);
            })
        );
    }
}

export function deactivate(): void {
    // No resources need manual disposal. VS Code disposes registered commands automatically.
}

function getConfig(): GeneratorConfig {
    const config = vscode.workspace.getConfiguration('generateString');
    return {
        defaultLength: clamp(config.get<number>('defaultLength', 32), 1, 4096),
        passwordLength: clamp(config.get<number>('passwordLength', 24), 8, 256),
        slugWords: clamp(config.get<number>('slugWords', 4), 2, 12),
        copyToClipboard: config.get<boolean>('copyToClipboard', false),
        showSuccessMessage: config.get<boolean>('showSuccessMessage', true)
    };
}

async function insertGeneratedValue(value: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        await vscode.env.clipboard.writeText(value);
        vscode.window.showInformationMessage('Generated value copied to clipboard because no editor is active.');
        return;
    }

    const selections = editor.selections.length > 0 ? editor.selections : [editor.selection];
    await editor.edit((editBuilder) => {
        for (const selection of selections) {
            editBuilder.replace(selection, value);
        }
    });

    const config = getConfig();
    if (config.copyToClipboard) {
        await vscode.env.clipboard.writeText(value);
    }

    if (config.showSuccessMessage) {
        vscode.window.setStatusBarMessage(`Generated string inserted${config.copyToClipboard ? ' and copied' : ''}.`, 2500);
    }
}

async function generateCustomString(): Promise<string | undefined> {
    const lengthInput = await vscode.window.showInputBox({
        title: 'Generate Custom Random String',
        prompt: 'Enter the desired string length.',
        value: getConfig().defaultLength.toString(),
        validateInput: (value) => {
            const parsed = Number(value);
            if (!Number.isInteger(parsed) || parsed < 1 || parsed > 4096) {
                return 'Length must be a whole number between 1 and 4096.';
            }
            return undefined;
        }
    });

    if (!lengthInput) {
        return undefined;
    }

    const charsetChoice = await vscode.window.showQuickPick(
        [
            { label: 'Alphanumeric', description: 'A-Z, a-z, 0-9', value: 'alphanumeric' as RandomCharset },
            { label: 'Letters Only', description: 'A-Z, a-z', value: 'letters' as RandomCharset },
            { label: 'Numbers Only', description: '0-9', value: 'numbers' as RandomCharset },
            { label: 'Hexadecimal', description: '0-9, a-f', value: 'hex' as RandomCharset },
            { label: 'Base64URL Safe', description: 'A-Z, a-z, 0-9, -, _', value: 'base64url' as RandomCharset },
            { label: 'Symbols Only', description: 'Common punctuation symbols', value: 'symbols' as RandomCharset },
            { label: 'Password Safe Mixed', description: 'Readable secure password characters', value: 'safePassword' as RandomCharset },
            { label: 'Custom Character Set...', description: 'Provide your own allowed characters', value: 'custom' as RandomCharset }
        ],
        {
            title: 'Choose a character set',
            placeHolder: 'Select which characters may appear in the generated string.'
        }
    );

    if (!charsetChoice) {
        return undefined;
    }

    const length = Number(lengthInput);

    if (charsetChoice.value !== 'custom') {
        return randomString(length, charsetChoice.value);
    }

    const customCharset = await vscode.window.showInputBox({
        title: 'Custom Character Set',
        prompt: 'Enter every character that may appear in the generated string.',
        validateInput: (value) => {
            if (!value || value.length < 2) {
                return 'Enter at least two allowed characters.';
            }
            return undefined;
        }
    });

    if (!customCharset) {
        return undefined;
    }

    return randomStringFromCharset(length, customCharset);
}

function randomHash(algorithm: 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'): string {
    const seed = `${randomUUID()}:${Date.now()}:${randomBytes(64).toString('hex')}`;
    return createHash(algorithm).update(seed).digest('hex');
}

function randomHex(length: number): string {
    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function randomBase64(byteLength: number): string {
    return randomBytes(byteLength).toString('base64');
}

function randomBase64Url(byteLength: number): string {
    return randomBytes(byteLength)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function randomString(length: number, charset: Exclude<RandomCharset, 'custom'>): string {
    return randomStringFromCharset(length, CHARSETS[charset]);
}

function randomStringFromCharset(length: number, charset: string): string {
    const safeLength = clamp(length, 1, 4096);
    const uniqueChars = Array.from(new Set(Array.from(charset))).join('');
    if (uniqueChars.length < 2) {
        throw new Error('Random string generation requires at least two unique characters.');
    }

    const bytes = randomBytes(safeLength * 2);
    let output = '';

    for (let index = 0; output.length < safeLength; index++) {
        if (index >= bytes.length) {
            return output + randomStringFromCharset(safeLength - output.length, uniqueChars);
        }
        output += uniqueChars[bytes[index] % uniqueChars.length];
    }

    return output;
}

function randomSlug(wordCount: number): string {
    const count = clamp(wordCount, 2, 12);
    const words: string[] = [];

    while (words.length < count) {
        const word = SLUG_WORDS[randomBytes(1)[0] % SLUG_WORDS.length];
        if (!words.includes(word)) {
            words.push(word);
        }
    }

    return `${words.join('-')}-${randomHex(6)}`;
}

function clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) {
        return min;
    }
    return Math.min(Math.max(Math.trunc(value), min), max);
}
