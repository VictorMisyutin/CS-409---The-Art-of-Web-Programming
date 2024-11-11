var color = 'blue'
function fetchColorAndSetButtonColor(url) {
    return fetch(url) 
        .then(response => response.json())
        .then(data => {
            const color = data.color;
            setButtonColor(color);
        })
        .catch(error => {
            console.error('Error fetching color:', error);
        });
}

fetchColorAndSetButtonColor("/getColor");
