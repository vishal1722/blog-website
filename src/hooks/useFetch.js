import { fa } from "zod/v4/locales";

export const useFetch = async (url, options = {}, dependencies= []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    try {
        const response = await fetch(url, options);
        const result = await response.json();
    } catch (error) {
        
    }



}
 