module.exports = (sequelize, DataTypes) => {
  const AiQueryLog = sequelize.define('AiQueryLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    query_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    response_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    context_meta: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'ai_query_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return AiQueryLog;
};
