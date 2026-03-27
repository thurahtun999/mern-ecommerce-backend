const adminMiddleware = (req, res, next) => {

    console.log(req.user);
    if (req.user && req.user.role == "admin") {
        next();
    } else {
        res.status(403).json({message: "Admin access only"});
    }
}

//Admin only product create
export const admin = (req, res, next) => {
    //temporaly
  
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as admin");
    }
};
export default adminMiddleware;
