import Comment from '../../models/Comment.js';

export default async (req, res, next) => {
    try {

        const queries = {};
        const ordering = { createdAt: -1 };
        const pagination = { page: 1, limit: 4 };

        if (req.query.chapter_id) { queries.chapter_id = req.query.chapter_id }
        if (req.query.sort) { ordering.createdAt = Number(req.query.sort) }
        if (req.query.page) { pagination.page = Number(req.query.page) }
        if (req.query.quantity) { pagination.limit = Number(req.query.quantity) }

        const skip = pagination.page > 0 ? (pagination.page - 1) * pagination.limit : 0;
        const limit = pagination.limit > 0 ? pagination.limit : 4;
        const allMangas = await Comment.countDocuments(queries);
        
        const pages = Math.ceil(allMangas / pagination.limit);
        const prev = pagination.page === 1 ? null : pagination.page - 1;
        const next = pagination.page === pages ? null : pagination.page + 1;

        const comments = await Comment.find(queries).skip(skip).limit(limit).sort(ordering);
        
        if (comments.length != 0) {
            return res.status(200).json({ response: { comments, prev, next, pages }, message: 'comments found!' })
        } else {
            return res.status(404).json({ response: null, message: 'comments not found' })
        }

    } catch (error) {
        next(error)
    }
}