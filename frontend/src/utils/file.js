export const fetchImage = async (image) => {
    let fileName = image.split('/').pop();
    const fileExtension = fileName.split('.').pop();
    const res = await fetch(image);
    const buf = await res.arrayBuffer();
    return new File([buf], fileName, {type: `image/${fileExtension}`});
}
