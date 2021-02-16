export function generateFormData(file, replyText, isReply, parent, parentType) {
    let formData = new FormData();

    if(file !== undefined || file !== null)
        formData.append('file', file);
    if(replyText !== '')
        formData.append('text', replyText);
    
    formData.append('postType', isReply ? 'reply' : 'comment');
    formData.append('parent', parent);
    formData.append('parentType', parentType);

    return formData
}