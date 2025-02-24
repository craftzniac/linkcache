import { useState, useEffect, useCallback } from "react"

type ReturnValue<T> = { data: T | null, isLoading: boolean, error: string | null, isError: boolean };


export async function delay() {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 2000)
    });
}


export default function useQuery<TReturn>({
    queryFn
}: {
    queryFn: () => Promise<TReturn>
}): ReturnValue<TReturn> {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<null | TReturn>(null)

    const runner = useCallback(async () => {
        try {
            setIsLoading(true)
            const da = await queryFn();
            setData(da)
            setIsError(false)
        } catch (err) {
            setIsError(true)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((err as unknown as any).toString())
        } finally {
            setIsLoading(false)
        }
    }, [queryFn])

    useEffect(() => {
        runner()
    }, [runner])

    return {
        data, isLoading, error, isError
    }

}
