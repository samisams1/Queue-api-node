module.exports =(sequelize,Sequelize) =>{
    const WinowNumber = sequelize.define("windowNumbers",{
 value: {
        type:Sequelize.STRING
    }
    });
    return WinowNumber;
};
