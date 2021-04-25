module.exports = { 
    getComments: (res) => {
        let query = "SELECT * FROM comments;"
        
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results)
            }
        })
    },
    getCommentReplies: (res, commentNum) => {
        let query = `SELECT child_post_num FROM replies WHERE parent_post_num = ${commentNum};`
        
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results.map(result => result.child_post_num))
            }
        })
    },
    deleteSpecificComments: (res, commentNums, adminUsername) => {
        let query = `DELETE FROM comments WHERE post_num IN (${commentNums});
                DELETE FROM replies where child_post_num IN (${commentNums});
                UPDATE admins SET commentsDeleted = commentsDeleted + ${commentNums.length} WHERE username = '${adminUsername}';
                UPDATE admins SET totalPostsDeleted = totalPostsDeleted + ${commentNums.length} WHERE username = '${adminUsername}';
                UPDATE admins SET lastDeletionDate = '${new Date().toISOString().slice(0, 19).replace('T', ' ')}' WHERE username = '${adminUsername}';`


        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.status(200).end()
            }
        })
    },
    createComment: (res, commentData, parentPostNum) => {
        delete commentData.post_id
        const countPosts = `UPDATE total_posts SET count = @count := count + 1; SELECT @count;`
        db.query(countPosts, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                commentData.post_num = results[1][0]['@count']
                
                let commentQuery = `INSERT INTO comments (
                        ${Object.keys(commentData).join(',')}
                    )
                    VALUES
                    (
                        ${Object.keys(commentData).map(key => {
                            if(key !== 'post_num' && key !== 'hasImage' && key !== 'parentThread') {
                                return `'${commentData[key]}'`
                            }
                            else {
                                return commentData[key]
                            }
                            })
                        }
                    );
                `
                
                if (parentPostNum > 0) {
                    commentQuery += `
                        INSERT INTO replies(parent_post_num, child_post_num)
                        VALUES (${parentPostNum}, ${commentData.post_num});
                    `
                }
                db.query(commentQuery, (err, results) => {
                    if(err) {
                        res.status(500).send(err) 
                    }
                    else {
                        res.status(201).json(commentData)
                    }
                })
            }
        })
    }
}