import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1634567890124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Running InitialSchema1634567890124 migration');

    await queryRunner.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bio TEXT,
        skills TEXT,
        profile_image VARCHAR(255),
        role ENUM('client', 'freelancer') NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        description TEXT NOT NULL,
        budget DECIMAL(10, 2) NOT NULL,
        deadline DATE NOT NULL,
        client_id INT NOT NULL,
        freelancer_id INT,
        FOREIGN KEY (client_id) REFERENCES users(id),
        FOREIGN KEY (freelancer_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE bids (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        freelancer_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        duration INT NOT NULL,
        message TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (freelancer_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        user_id INT NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE milestones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        due_date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'paid') DEFAULT 'pending',
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE invoices (
        id INT PRIMARY KEY AUTO_INCREMENT,
        milestone_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'paid') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (milestone_id) REFERENCES milestones(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE skills (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE invoices`);
    await queryRunner.query(`DROP TABLE milestones`);
    await queryRunner.query(`DROP TABLE files`);
    await queryRunner.query(`DROP TABLE messages`);
    await queryRunner.query(`DROP TABLE bids`);
    await queryRunner.query(`DROP TABLE projects`);
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`DROP TABLE skills`);
  }
}