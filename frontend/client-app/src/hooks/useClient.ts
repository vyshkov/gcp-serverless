import { Word } from "../types";
import useFetch from "./useFetch";

function useClient() {
    const myFetch = useFetch();

    return {
        getAllWords: () => 
            myFetch({ route: "service-dictionary" })
                .then(words => words.sort((a: Word, b: Word) => b.lastUpdated - a.lastUpdated)),
        deleteWord: (id: string) => 
            myFetch({ route: `service-dictionary/${id}`, method: "DELETE" }),
        addWord: (english: string, ukrainian: string) =>
            myFetch({ route: "/service-dictionary", method: "POST", body: {
                word: english,
                translation: ukrainian,
            }}),
        translateAzure: (
            text: string, 
            from: string, 
            to: string, 
            abortController: AbortController 
        ) => myFetch({ 
            route: "service-translation/translate", 
            method: "POST", 
            body: { text, from, to},
            abortController,
        }),
        translateGoogle: (
            text: string, 
            from: string, 
            to: string, 
            abortController: AbortController 
        ) => myFetch({ 
            route: "service-translation/translateGoogle", 
            method: "POST", 
            body: { text, from, to},
            abortController,
        })
    }
}


export default useClient;