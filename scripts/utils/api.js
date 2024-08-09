export async function fetchPhotographerData() {
    let url = "data/photographers.json";
    const response = await fetch(url);
    try {
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data:`, error);
        return null;
    }
}

export async function getAllPhotographerData() {
    const data = await fetchPhotographerData();
    if (!data) {
        console.error(`Error fetching data:`, error);
        return null;
    }
    const { photographers, media } = data;
    return { photographers, media };
}
