const createProduct = async (req, res) => {
    res.send("create product route");
};

const getAllProducts = async (req, res) => {
    res.send("get all products route");
};

const getSingleProduct = async (req, res) => {
    res.send("get single product route");
};

const updateProduct = async (req, res) => {
    res.send("update product route");
};

const deleteProduct = async (req, res) => {
    res.send("delete product route");
};

const uploadImage = async (req, res) => {
    res.send("upload image route");
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};