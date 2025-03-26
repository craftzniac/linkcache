export async function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    });
}


export function isValidUrl(text: string): boolean {
    const pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return pattern.test(text);
}

