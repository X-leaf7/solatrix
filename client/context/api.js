import { GET_CMS_CONTENT } from "./AppUrl"

export function getCMSContent(name, setter) {
    fetch(GET_CMS_CONTENT + name + '/', {
        method: 'get',
    }).then(async (response) => {
        let responseText = await response.text();
        let contentHolder = document.createElement('div');
        contentHolder.innerHTML = responseText.trim();
        let innerContent = contentHolder.querySelector('#cms-content');
        setter(innerContent.textContent);
    }).catch(err => {
        console.log(err)
    });
}