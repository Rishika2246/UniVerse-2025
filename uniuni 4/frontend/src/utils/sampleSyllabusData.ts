/**
 * Sample syllabus data for testing the Mind Map Helper
 * This simulates what would be extracted from a real PDF
 */

export const sampleSyllabusText = `
DATABASE MANAGEMENT SYSTEMS
Course Code: CS301
Department: Computer Science Engineering
Semester: 5th
Credits: 4

SYLLABUS

UNIT 1: Introduction to Database Systems
Database System Applications, Purpose of Database Systems, View of Data, Database Languages, Database Design, Database Architecture, Database Users and Administrators, Transaction Management, Database System Structure, Application Architectures.
Topics:
- Data Models: Entity-Relationship Model, Relational Model, Object-based Data Models
- Schema and Instances: Database Schema, Database State
- Data Independence: Physical Data Independence, Logical Data Independence
- Database Languages: DDL, DML, DCL, TCL

UNIT 2: Entity-Relationship Model
Basic Concepts, Design Issues, Mapping Constraints, Keys, Entity-Relationship Diagram, Extended ER Features, Design of ER Database Schema, Reduction of ER Schema to Tables, Generalization, Specialization, Aggregation.
Topics:
- Entity Sets and Attributes: Simple, Composite, Multi-valued attributes
- Relationship Sets: Binary, Ternary relationships, Degree of relationship
- Constraints: Cardinality constraints, Participation constraints
- Weak Entity Sets: Identifying entity, Partial key

UNIT 3: Relational Model and SQL
Structure of Relational Databases, Relational Algebra, Tuple Relational Calculus, Domain Relational Calculus, Basic SQL, Advanced SQL, Integrity Constraints, Triggers, Embedded SQL, Dynamic SQL.
Topics:
- Relational Operations: Select, Project, Union, Set difference, Cartesian product, Join
- SQL Queries: Select statements, Aggregate functions, Group by, Having clause
- Views: Creating views, Updating views, Materialized views
- Joins: Inner join, Outer join, Natural join, Cross join

UNIT 4: Database Design
Functional Dependencies, Decomposition, Normalization using Functional Dependencies, Multivalued Dependencies, Join Dependencies, Domain-Key Normal Form, Denormalization.
Topics:
- Normal Forms: 1NF, 2NF, 3NF, BCNF
- Functional Dependency: Armstrong's axioms, Closure of attributes
- Decomposition: Lossless join, Dependency preservation
- Database Design Process: Requirements analysis, Conceptual design, Logical design

UNIT 5: Transaction Management
Transaction Concept, Transaction State, Implementation of Atomicity and Durability, Concurrent Executions, Serializability, Recoverability, Implementation of Isolation, Testing for Serializability, Lock-Based Protocols, Timestamp-Based Protocols, Validation-Based Protocols, Multiple Granularity, Recovery and Atomicity, Log-Based Recovery, Recovery with Concurrent Transactions.
Topics:
- ACID Properties: Atomicity, Consistency, Isolation, Durability
- Concurrency Control: Lock-based, Timestamp-based, Optimistic concurrency control
- Deadlock: Detection, Prevention, Recovery
- Recovery Techniques: Immediate update, Deferred update, Checkpoints

UNIT 6: Storage and Indexing
File Organization, Organization of Records in Files, Indexing and Hashing, Ordered Indices, B+ Tree Index Files, B Tree Index Files, Static Hashing, Dynamic Hashing, Comparison of Ordered Indexing and Hashing, Index Definition in SQL.
Topics:
- File Structures: Heap files, Sorted files, Hashed files
- Indexing Techniques: Primary index, Secondary index, Clustering index
- B+ Trees: Structure, Operations, Performance
- Hashing: Static hashing, Dynamic hashing, Extendible hashing

Reference Books:
1. Database System Concepts - Silberschatz, Korth, Sudarshan
2. Fundamentals of Database Systems - Elmasri, Navathe
3. Database Management Systems - Raghu Ramakrishnan
`;

export const sampleWebDevSyllabus = `
WEB DEVELOPMENT
Course Code: CS402
Department: Computer Science
Semester: 6th

UNIT 1: HTML5 and CSS3 Fundamentals
HTML5 Semantic Elements, Forms and Input Types, Canvas and SVG, Audio and Video, CSS3 Selectors, Box Model, Flexbox, Grid Layout, Transitions and Animations, Responsive Design, Media Queries, CSS Variables.

UNIT 2: JavaScript Programming
Variables and Data Types, Functions and Scope, Objects and Arrays, DOM Manipulation, Event Handling, AJAX and Fetch API, Promises and Async/Await, ES6+ Features, Error Handling, Local Storage and Session Storage.

UNIT 3: Frontend Frameworks
React Fundamentals, Components and Props, State Management, Hooks, Context API, React Router, Redux Basics, Vue.js Introduction, Angular Overview, Component Communication.

UNIT 4: Backend Development
Node.js Basics, Express Framework, RESTful APIs, Database Integration, Authentication and Authorization, JWT Tokens, Session Management, File Upload, Error Handling, Security Best Practices.

UNIT 5: Databases and ORMs
MongoDB Basics, Mongoose ODM, MySQL and PostgreSQL, SQL vs NoSQL, Database Design, Queries and Aggregations, Indexing, Performance Optimization, Transactions, Replication.
`;

export const sampleMachineLearningSyllabus = `
MACHINE LEARNING
Course Code: CS501
Department: Artificial Intelligence & Data Science

UNIT 1: Introduction to Machine Learning
Types of Learning, Supervised Learning, Unsupervised Learning, Reinforcement Learning, Machine Learning Applications, Model Evaluation, Overfitting and Underfitting, Bias-Variance Tradeoff, Cross-Validation.

UNIT 2: Supervised Learning Algorithms
Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines, K-Nearest Neighbors, Naive Bayes, Ensemble Methods, Gradient Boosting, Neural Networks.

UNIT 3: Unsupervised Learning
K-Means Clustering, Hierarchical Clustering, DBSCAN, Principal Component Analysis, t-SNE, Association Rule Mining, Anomaly Detection, Dimensionality Reduction.

UNIT 4: Deep Learning
Neural Networks Architecture, Backpropagation, Activation Functions, Convolutional Neural Networks, Recurrent Neural Networks, LSTM, GRU, Autoencoders, GANs, Transfer Learning.

UNIT 5: Model Optimization and Deployment
Hyperparameter Tuning, Grid Search, Random Search, Model Evaluation Metrics, Feature Engineering, Feature Selection, Model Deployment, MLOps, Model Monitoring.
`;