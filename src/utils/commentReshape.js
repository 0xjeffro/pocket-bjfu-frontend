function commentReshape(lis) {
    let openId2nickName = new Map()
    let commentId2nickName = new Map()
    let cnt = 1;

    let AuthorId = -1 //记录Author(楼主)的id

    for (let i of lis) {
        if(openId2nickName.get(i.openId)===undefined) {
            openId2nickName.set(i.openId, cnt)
            cnt += 1
        }
        commentId2nickName.set(i.id, openId2nickName.get(i.openId))
        if (i.isAuthor) {
            AuthorId = openId2nickName.get(i.openId)
        }
    }
    for (let i of lis) {
        i.nickname = "同学 " + openId2nickName.get(i.openId)
        if (i.reply===-1) {
            i.action = ""
            i.actionTo = ""
        } else {
            i.action = "回复"
            i.actionTo = "同学 " + commentId2nickName.get(i.reply)
            if (commentId2nickName.get(i.reply) === AuthorId) {
                i.actionTo += "【楼主】"
            }
        }
    }
    let deep1 = [], deep2 = []
    for (let i of lis) {
        if(i.deep===1) {
            deep1.push(i)
        } else if(i.deep===2){
            deep2.push(i)
        }
    }
    let reply2comments = new Map()
    for (let i of deep2) {
        if (reply2comments.get(i.commentId)===undefined) {
            reply2comments.set(i.commentId, [])
        }
        reply2comments.get(i.commentId).push(i)
    }
    for (let i of deep1) {
        if (reply2comments.get(i.id)===undefined) {
            i.comments = []
        } else {
            i.comments = reply2comments.get(i.id)
        }
    }
    return deep1
}

module.exports = {
    commentReshape: commentReshape
}