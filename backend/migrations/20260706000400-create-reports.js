'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      week_start: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      week_end: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tasks_completed: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tasks_planned: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      blockers: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hours_worked: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'submitted', 'late'),
        allowNull: false,
        defaultValue: 'draft'
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addConstraint('reports', {
      fields: ['user_id', 'project_id', 'week_start'],
      type: 'unique',
      name: 'uq_reports_user_project_week'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reports');
  }
};
