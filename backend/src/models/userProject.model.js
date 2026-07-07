module.exports = (sequelize, DataTypes) => {
  const UserProject = sequelize.define('UserProject', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_projects',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'project_id']
      }
    ]
  });

  return UserProject;
};
