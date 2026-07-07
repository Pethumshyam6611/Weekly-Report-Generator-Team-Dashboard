module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
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
    week_start: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    week_end: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tasks_completed: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tasks_planned: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    blockers: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hours_worked: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'late'),
      allowNull: false,
      defaultValue: 'draft'
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'reports',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'project_id', 'week_start']
      }
    ]
  });

  return Report;
};
