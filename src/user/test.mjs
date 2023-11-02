export const getTest = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello test' })
    };

    return response;
}