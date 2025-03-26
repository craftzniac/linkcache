export async function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    });
}


export function isValidUrl(text: string): boolean {
    const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
    return pattern.test(text);
}
