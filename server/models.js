import { Sequelize, DataTypes } from "sequelize";
export const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
);
const options = { timestamps: false };
export const Category = db.define(
  "category",
  { name: { type: DataTypes.STRING(60), allowNull: false } },
  { ...options, tableName: "categories" },
);
export const Specialty = db.define(
  "specialty",
  {
    name: { type: DataTypes.STRING(80), allowNull: false },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
    },
  },
  { ...options, tableName: "specialties" },
);
export const Artisan = db.define(
  "artisan",
  {
    name: DataTypes.STRING(120),
    rating: DataTypes.DECIMAL(2, 1),
    city: DataTypes.STRING(100),
    about: DataTypes.TEXT,
    email: DataTypes.STRING(254),
    website: DataTypes.STRING(255),
    top: DataTypes.BOOLEAN,
    image: DataTypes.STRING(255),
    specialtyId: { type: DataTypes.INTEGER, field: "specialty_id" },
  },
  { ...options, tableName: "artisans" },
);
Category.hasMany(Specialty, { foreignKey: "categoryId" });
Specialty.belongsTo(Category, { foreignKey: "categoryId" });
Specialty.hasMany(Artisan, { foreignKey: "specialtyId" });
Artisan.belongsTo(Specialty, { foreignKey: "specialtyId" });
