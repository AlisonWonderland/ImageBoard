module.exports = {
    getThreads: (res) => {
        let query = "SELECT * FROM threads;"
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results)
            }
        })
    }, 
    getThreadReplies: (res, threadNum) => {
        let query = `SELECT child_post_num FROM replies WHERE parent_post_num = ${threadNum};`
        
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results.map(result => result.child_post_num))
            }
        })
    }, 
    getThreadData: (res, threadNum) => {
        let query = `SELECT (SELECT COUNT(*) FROM comments WHERE parentThread = ${threadNum}) as num_comments,
            (SELECT COUNT(*) FROM comments WHERE parentThread = ${threadNum} AND hasImage = TRUE) as num_images;`

        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results[0])
            }
        })
    },
    getThreadComments: (res, threadNum) => {
        let query = `SELECT * FROM comments WHERE parentThread = ${threadNum};`

        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results)
            }
        }) 
    }, //tested
    getCatalogThreads: (res) => {
        let query = `SELECT threads.post_num,
        threads.post_text,
        threads.thumbnail125URL,
        threads.post_date,
        COUNT(comments.parentThread) AS num_comments, 
        COUNT(case comments.hasImage when TRUE then 1 else null end ) AS num_images
        FROM comments 
        RIGHT JOIN threads ON threads.post_num = comments.parentThread 
        GROUP BY threads.post_num, threads.post_text, threads.thumbnail125URL, threads.post_date;
        `

        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results)
            }
        }) 
    }, 
    getThread: (res, threadNum) => {
        let query = `SELECT * FROM threads WHERE post_num = ${threadNum};`
       
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.json(results[0])
            }
        })
    },
    deleteAllThreads: (res) => {
        let query = `DELETE FROM threads;`
        
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.status(200).end()
            }
        })
    },
    deleteSpecificThreads: (res, threadNums, adminUsername) => {
        let query = `DELETE FROM threads WHERE post_num IN (${threadNums});
                DELETE FROM comments WHERE parentThread IN (${threadNums});
                DELETE FROM replies WHERE parent_post_num IN (${threadNums});
                UPDATE admins SET threadsDeleted = threadsDeleted + ${threadNums.length} WHERE username = '${adminUsername}';
                UPDATE admins SET totalPostsDeleted = totalPostsDeleted + ${threadNums.length} WHERE username = '${adminUsername}';
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
    deleteSpecificThread: (res, threadNum) => {
        let query = `DELETE FROM threads WHERE post_num = (${threadNum});`
        
        db.query(query, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                res.status(200).end()
            }
        })
    },
    createThread: (res, threadData) => {
        const countPosts = `UPDATE total_posts SET count = @count := count + 1; SELECT @count;`

        db.query(countPosts, (err, results) => {
            if(err) {
                res.status(500).send(err) 
            }
            else {
                threadData.post_num = results[1][0]['@count']
                let addThread = `INSERT INTO threads (
                        post_num, 
                        post_text,
                        post_url,
                        thumbnail125URL,
                        thumbnail250URL,
                        post_dimensions,
                        post_date,
                        filetype,
                        post_filename,
                        post_id
                    )
                    VALUES
                    (
                        ${threadData.post_num}, 
                        '${threadData.post_text}',
                        '${threadData.post_url}',
                        '${threadData.thumbnail125URL}',
                        '${threadData.thumbnail250URL}',
                        '${threadData.post_dimensions}',
                        '${threadData.post_date}',
                        '${threadData.filetype}',
                        '${threadData.post_filename}',
                        '${threadData.post_id}'
                    );
                `
                
                db.query(addThread, (err, results) => {
                    if(err) {
                        res.status(500).send(err) 
                    }
                    else {
                        res.status(201).json(threadData)
                    }
                })
            }
        })
    }
}