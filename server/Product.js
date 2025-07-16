const Product = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Uncategorized",
    },
    image: {
      type: DataTypes.TEXT, // base64 or URL
    },
    serial: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  // Optional: associate with Business model
  Product.associate = (models) => {
    Product.belongsTo(models.Business, {
      foreignKey: "BusinessId",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
