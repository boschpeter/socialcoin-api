-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: socialcoin
-- ------------------------------------------------------
-- Server version	5.7.23-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `socialcoin`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `socialcoin` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `socialcoin`;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `description` longtext NOT NULL,
  `storageLocation` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `duration` double DEFAULT NULL,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
INSERT INTO `actions` VALUES (1,'1','paused because of the rain','c:/images/1.png','2018-08-10 09:00:00','2018-08-10 10:00:00',NULL,NULL,'2018-08-10 15:09:51',NULL,'2018-08-10 15:09:51',NULL),(2,'2','done','c:/images/2.png','2018-08-10 09:00:00','2018-08-10 09:00:00',NULL,NULL,'2018-08-10 15:09:51',NULL,'2018-08-10 15:09:51',NULL);
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_labels`
--

DROP TABLE IF EXISTS `app_labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_labels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `name` varchar(255) NOT NULL,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_labels`
--

LOCK TABLES `app_labels` WRITE;
/*!40000 ALTER TABLE `app_labels` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_labels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_languages`
--

DROP TABLE IF EXISTS `app_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `local_name` varchar(255) NOT NULL,
  `english_name` varchar(255) NOT NULL,
  `creationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`local_name`),
  UNIQUE KEY `english_name_UNIQUE` (`english_name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_languages`
--

LOCK TABLES `app_languages` WRITE;
/*!40000 ALTER TABLE `app_languages` DISABLE KEYS */;
INSERT INTO `app_languages` VALUES (1,'en','English','English','2018-07-29 17:38:09','admin','2018-07-29 17:38:09','admin'),(2,'nl','Nederlands','Dutch','2018-07-29 17:38:09','admin','2018-07-29 17:38:09','admin');
/*!40000 ALTER TABLE `app_languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_translations`
--

DROP TABLE IF EXISTS `app_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `app_languages_id` int(11) NOT NULL,
  `app_labels_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_app_translations_app_languages1_idx` (`app_languages_id`),
  KEY `fk_app_translations_app_labels1_idx` (`app_labels_id`),
  CONSTRAINT `fk_app_translations_app_labels1` FOREIGN KEY (`app_labels_id`) REFERENCES `app_labels` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_app_translations_app_languages1` FOREIGN KEY (`app_languages_id`) REFERENCES `app_languages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_translations`
--

LOCK TABLES `app_translations` WRITE;
/*!40000 ALTER TABLE `app_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit`
--

DROP TABLE IF EXISTS `audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tablename` varchar(255) NOT NULL,
  `crud_operation` varchar(45) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) NOT NULL,
  `query` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit`
--

LOCK TABLES `audit` WRITE;
/*!40000 ALTER TABLE `audit` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `relations_id` int(11) NOT NULL,
  `locations_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `relation_fk_idx` (`relations_id`),
  KEY `fk_cities_locations1_idx` (`locations_id`),
  CONSTRAINT `fk_cities_locations1` FOREIGN KEY (`locations_id`) REFERENCES `locations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `relation_fk1` FOREIGN KEY (`relations_id`) REFERENCES `relations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debts`
--

DROP TABLE IF EXISTS `debts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `debts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `relations_id` int(11) NOT NULL,
  `debt_lc` double NOT NULL DEFAULT '0',
  `debtDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` longtext,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_debts_relations1_idx` (`relations_id`),
  CONSTRAINT `fk_debts_relations1` FOREIGN KEY (`relations_id`) REFERENCES `relations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debts`
--

LOCK TABLES `debts` WRITE;
/*!40000 ALTER TABLE `debts` DISABLE KEYS */;
INSERT INTO `debts` VALUES (1,'a8c0d3d5-5314-47ee-88c7-aaa2619c5199',52,10,'2018-08-10 12:57:34',NULL,NULL,'2018-08-10 15:33:03','127.0.0.1','2018-08-10 15:33:03','127.0.0.1'),(2,'1',52,10,'2018-08-10 00:00:00',NULL,NULL,'2018-08-10 17:35:54',NULL,'2018-08-10 17:35:54',NULL),(3,'1720a446-43ba-482e-8508-3f8e95ee1e75',70,10,'2018-08-10 15:47:34',NULL,NULL,'2018-08-10 17:47:34',NULL,'2018-08-10 17:47:34',NULL),(19,'6e59d8f7-67f9-4235-abfb-0da9f2166faa',102,999,'2018-08-13 11:23:29',NULL,NULL,'2018-08-13 11:23:29','127.0.0.1','2018-08-13 11:23:29','127.0.0.1'),(21,'87c78291-2171-4f91-8c51-026f9aba1638',104,999,'2018-08-13 11:23:29',NULL,NULL,'2018-08-13 11:23:29','127.0.0.1','2018-08-13 11:23:29','127.0.0.1'),(22,'511fe169-12fa-4043-af4a-bfd6faff2648',105,999,'2018-08-15 08:32:13',NULL,NULL,'2018-08-15 08:32:13','127.0.0.1','2018-08-15 08:32:13','127.0.0.1');
/*!40000 ALTER TABLE `debts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `streetname` varchar(255) NOT NULL,
  `housenumber` varchar(45) NOT NULL,
  `housenumber_suffix` varchar(45) DEFAULT NULL,
  `postalcode` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `description` longtext,
  `latitude` varchar(45) DEFAULT NULL,
  `longitude` varchar(45) DEFAULT NULL,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'6cc6f989-e6f3-44ba-84a1-0af0baa7875d','Valkstraat','6',NULL,'6611KW','Overasselt',NULL,NULL,NULL,NULL,'2018-08-07 12:53:35','127.0.0.1','2018-08-07 12:53:35','127.0.0.1'),(2,'f31616c9-4dab-42da-9145-d0a1dfa839a7','streetname1','string',NULL,'string','string','created with team',NULL,NULL,NULL,'2018-08-13 07:57:39','127.0.0.1','2018-08-13 07:57:39','127.0.0.1'),(4,'8f957fa3-4134-406d-a9f0-adf077c13e36','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 08:25:35','127.0.0.1','2018-08-13 08:25:35','127.0.0.1'),(6,'e64a2d8c-1494-4f5f-9a1b-4f50d94d60f8','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:44:56','127.0.0.1','2018-08-13 09:44:56','127.0.0.1'),(7,'e609cb7a-6797-44cc-b1ca-bfd695fd0506','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:46:33','127.0.0.1','2018-08-13 09:46:33','127.0.0.1'),(8,'4caaa903-9e20-416c-bc44-535b0aa3bb49','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:47:00','127.0.0.1','2018-08-13 09:47:00','127.0.0.1'),(9,'0a1cafb6-7992-4a4f-8b7b-d2893f7c565d','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:48:01','127.0.0.1','2018-08-13 09:48:01','127.0.0.1'),(10,'37f37f1e-c491-4d88-8e47-eac03bf5bfca','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:49:43','127.0.0.1','2018-08-13 09:49:43','127.0.0.1'),(11,'116ca8e5-575d-4dd6-951c-72576914dca3','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:50:11','127.0.0.1','2018-08-13 09:50:11','127.0.0.1'),(12,'f04ea097-074c-499d-b391-1c11dc551272','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:50:42','127.0.0.1','2018-08-13 09:50:42','127.0.0.1'),(13,'83ee4637-133c-4bbf-a131-7cbe8f48701c','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:51:06','127.0.0.1','2018-08-13 09:51:06','127.0.0.1'),(14,'df816893-e2c2-4353-8d4f-d5643cd96b63','Avenida da Liberdade','1',NULL,'000000','Lisbon','created with team',NULL,NULL,NULL,'2018-08-13 09:51:47','127.0.0.1','2018-08-13 09:51:47','127.0.0.1'),(22,'cc3c6f3f-38fe-4f76-b8b8-572e7fb72421','streetname','string',NULL,'string','string','created with relation',NULL,NULL,NULL,'2018-08-13 11:23:29','127.0.0.1','2018-08-13 11:23:29','127.0.0.1'),(25,'deb2fdcb-3f00-4574-bb26-d0711d87c442','Valkstraat','6',NULL,'6611KW','Overasselt','created with relation',NULL,NULL,NULL,'2018-08-15 08:32:13','127.0.0.1','2018-08-15 08:32:13','127.0.0.1');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!50001 DROP VIEW IF EXISTS `participants`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `participants` AS SELECT 
 1 AS `id`,
 1 AS `locations_id`,
 1 AS `firstname`,
 1 AS `prefix`,
 1 AS `lastname`,
 1 AS `participant`,
 1 AS `date_of_birth`,
 1 AS `phonenumber`,
 1 AS `email`,
 1 AS `description`,
 1 AS `username`,
 1 AS `creationDate`,
 1 AS `createdBy`,
 1 AS `modificationDate`,
 1 AS `modifiedBy`,
 1 AS `teamId`,
 1 AS `teamName`,
 1 AS `debt`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `privileges`
--

DROP TABLE IF EXISTS `privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `privileges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(255) NOT NULL,
  `column_name` varchar(255) NOT NULL,
  `create` varchar(1) NOT NULL DEFAULT '0',
  `retrieve` varchar(1) NOT NULL DEFAULT '0',
  `update` varchar(1) NOT NULL DEFAULT '0',
  `delete` varchar(1) NOT NULL DEFAULT '0',
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privileges`
--

LOCK TABLES `privileges` WRITE;
/*!40000 ALTER TABLE `privileges` DISABLE KEYS */;
/*!40000 ALTER TABLE `privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relations`
--

DROP TABLE IF EXISTS `relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `locations_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `prefix` varchar(15) DEFAULT NULL,
  `lastname` varchar(50) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `phonenumber` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `description` longtext,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `emailVerified` tinyint(3) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_relations_locations1_idx` (`locations_id`),
  CONSTRAINT `fk_relations_locations1` FOREIGN KEY (`locations_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relations`
--

LOCK TABLES `relations` WRITE;
/*!40000 ALTER TABLE `relations` DISABLE KEYS */;
INSERT INTO `relations` VALUES (52,'b23a0a39-48f3-4715-b595-e39ee2ba486c',1,'Theo',NULL,'Theunissen','1970-01-01 00:00:00','628617829','theo.theunissen@gmail.com',NULL,NULL,'theotheu','$2a$10$.MQ96jq/IRR6xikKkQDd4euPR8JsjWvSNx1qVPJ9P3Bpy0G0T6Z6.',1,NULL,NULL,'2018-08-07 15:01:23','127.0.0.1','2018-08-07 15:01:23','127.0.0.1'),(56,'ecb021d1-b81c-4e7b-a49a-728513cea125',1,'Theo',NULL,'Theunissen','1970-01-01 00:00:00','628617829','theo.theunissen@han.nl',NULL,NULL,'john.doe1@example.com','$2a$10$yni4hJ89LgNxPPjwB5xXw.q1lwkDPOTwghXfPJ121qHUkdO3Db2KW',1,NULL,NULL,'2018-08-08 08:53:16','127.0.0.1','2018-08-08 08:53:16','127.0.0.1'),(57,'1',1,'John','','Doe','1964-11-02 00:00:00','06-28617829','theo.theunissen+john.doe@gmail.com','participant',NULL,'johndoe','$2a$10$SVuRftMmHdde8yhXdNmlFeja9rMiK7RwECRXPUrSJwH/xBtmJ1iHW',1,NULL,NULL,'1970-01-01 00:00:00',NULL,'1970-01-01 00:00:00',NULL),(59,'2',1,'Theo','','Theunissen','1964-11-02 00:00:00','06-28617829','theo.theunissen+3@gmail.com','string',NULL,'theo.theunissen+3@gmail.com','$2a$10$MJkozdYSwSMysvL61GXNe.5Br5TCd5AsfmxKGFrQ3QQzKfpG.Y26e',NULL,NULL,NULL,'1970-01-01 00:00:00',NULL,'1970-01-01 00:00:00',NULL),(70,'9e34b58c-4698-4d26-a56d-60732dbc63d2',1,'Abigail','','Rigo','2018-08-10 12:57:34','012345678','theo.theunissen+abigail.Rigo@gmail.com',NULL,NULL,NULL,'$2a$10$nQRR7FAVnhQmjNuHbXbnJOFFZUj0qgPSA/CuDC91X30/M/xhoT/F.',NULL,'9d725dffd550e62eab79f50daf2a9a52cafeb9150af8437e8891cc0d4f253bdfb94eba7d89adae2537cafabba4bb8d735d015df2ac61d4a10ce2cad559794631',NULL,'2018-08-10 15:47:35','127.0.0.1','2018-08-10 15:47:35','127.0.0.1'),(88,'5524937e-5242-4290-92e9-43b16abfac7b',8,'Eusébio','undefined','undefined',NULL,'undefined','undefined','created with team',NULL,'undefined','PM1pKh9mvNrlPM1pKh9mvNrl',NULL,NULL,NULL,'2018-08-13 09:47:00','127.0.0.1','2018-08-13 09:47:00','127.0.0.1'),(89,'9667d71b-4d1c-4a74-b8f9-d8eb00efd591',9,'Eusébio','','da Silva Ferreira',NULL,'0123456789','theo.theunissen+eusebio@gmail.com','created with team',NULL,'theo.theunissen+eusebio@gmail.com','JFBcxakgadslJFBcxakgadsl',NULL,NULL,NULL,'2018-08-13 09:48:01','127.0.0.1','2018-08-13 09:48:01','127.0.0.1'),(90,'6db28e6f-e3a6-4c62-b392-02e8b1c2217a',10,'Eusébio','','da Silva Ferreira',NULL,'0123456789','theo.theunissen+eusebio@gmail.com','created with team',NULL,'theo.theunissen+eusebio@gmail.com','jYbrox8nT96ljYbrox8nT96l',NULL,NULL,NULL,'2018-08-13 09:49:43','127.0.0.1','2018-08-13 09:49:43','127.0.0.1'),(91,'fc571f6b-79b9-4111-a27a-228c8abda5a3',11,'Eusébio','','da Silva Ferreira',NULL,'0123456789','theo.theunissen+eusebio@gmail.com','created with team',NULL,'theo.theunissen+eusebio@gmail.com','K1qj4qUyojXkK1qj4qUyojXk',NULL,NULL,NULL,'2018-08-13 09:50:11','127.0.0.1','2018-08-13 09:50:11','127.0.0.1'),(92,'adec6ec3-0030-4f45-aea0-ef34d10e27e4',12,'Eusébio','','da Silva Ferreira',NULL,'0123456789','theo.theunissen+eusebio@gmail.com','created with team',NULL,'theo.theunissen+eusebio@gmail.com','hAsGjtId1C9ahAsGjtId1C9a',NULL,NULL,NULL,'2018-08-13 09:50:42','127.0.0.1','2018-08-13 09:50:42','127.0.0.1'),(93,'ff2b3988-2e72-4a0c-953a-de5dfdc7ef4e',13,'Eusébio','','da Silva Ferreira',NULL,'0123456789','theo.theunissen+eusebio@gmail.com','created with team',NULL,'theo.theunissen+eusebio@gmail.com','hL_8nkEDuBjAhL_8nkEDuBjA',NULL,NULL,NULL,'2018-08-13 09:51:06','127.0.0.1','2018-08-13 09:51:06','127.0.0.1'),(94,'88afc426-bf77-4d5b-93ca-1d5a119422c1',14,'Eusébio','','da Silva Ferreira',NULL,'0123456789','theo.theunissen+eusebio@gmail.com','created with team',NULL,'theo.theunissen+eusebio@gmail.com','LsIYlz8j6HoeLsIYlz8j6Hoe',NULL,NULL,NULL,'2018-08-13 09:51:47','127.0.0.1','2018-08-13 09:51:47','127.0.0.1'),(102,'e5820473-9e38-481b-aaea-0ff34969a4ee',22,'string','string','string','2018-08-11 09:26:04','string','theo.theunissen+string@gmail.com','string',NULL,'string','$2a$10$Gwcg.RrlkIzEY9QmdafAXOdovExgp/anfdQMSzYsvguB9VSbuwg6W',NULL,'a643c51fd36ffcf060d9a51d69a4b6e1ca8706554053874b7c772eb88619fcb7d5d2cf300c5180c2d4e6b9ed6f9a00c1fba9602df39f1e10a33d1b1b8c65f334',NULL,'2018-08-13 09:23:29','127.0.0.1','2018-08-13 09:23:29','127.0.0.1'),(104,'b3f3a270-a162-4d43-a547-93a52b6edc98',1,'Piet','','Schouten','1970-01-01 00:00:00','06-29229885','piet.schouten@socialcoin.nl','Master of socialcoin',NULL,'pietschouten','$2a$10$6mCg0Vrm7WpwjTttqgyLHuYv9sT12CrhsnK/c3IVQOoeYo/yqPVJG',NULL,'b9e7a7147ac666296328b7e4b8e2f7929f11261ff6e40e7cec1b6ad1712ef71049575f217248da33bbf18c1471673dfc0ddcf405699379e0046f01df82a08ceb',NULL,'2018-08-13 09:23:29','127.0.0.1','2018-08-13 09:23:29','127.0.0.1'),(105,'58b49d84-d60f-4f3f-aa7f-12182ed16494',1,'Theo','','Socialcoin','1970-01-01 00:00:00','06-12345678','theo.theunissen+socialcoin@gmail.com','Master of the universe',NULL,'socialcoin','$2a$10$mXFoYvq7BCfcR633HbxTs.l1ZbzzH/wX0GDDcPLvgQ5MTSPpr9hlu',1,NULL,NULL,'2018-08-15 06:32:13','127.0.0.1','2018-08-15 06:32:13','127.0.0.1');
/*!40000 ALTER TABLE `relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relations_with_roles`
--

DROP TABLE IF EXISTS `relations_with_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relations_with_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roles_id` int(11) NOT NULL,
  `relations_id` int(11) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_relations_with_roles_roles1_idx` (`roles_id`),
  KEY `fk_relations_with_roles_relations1_idx` (`relations_id`),
  CONSTRAINT `fk_relations_with_roles_relations1` FOREIGN KEY (`relations_id`) REFERENCES `relations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_relations_with_roles_roles1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relations_with_roles`
--

LOCK TABLES `relations_with_roles` WRITE;
/*!40000 ALTER TABLE `relations_with_roles` DISABLE KEYS */;
INSERT INTO `relations_with_roles` VALUES (2,12,57,'2018-08-10 12:03:50','127.0.0.1','2018-08-10 12:03:50','127.0.0.1'),(19,12,102,'2018-08-13 11:23:29','127.0.0.1','2018-08-13 11:23:29','127.0.0.1'),(21,10,104,'2018-08-13 11:23:29','127.0.0.1','2018-08-13 11:23:29','127.0.0.1'),(22,10,105,'2018-08-15 08:32:13','127.0.0.1','2018-08-15 08:32:13','127.0.0.1'),(23,13,104,'2018-08-16 12:16:20',NULL,'2018-08-16 12:16:20',NULL);
/*!40000 ALTER TABLE `relations_with_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relations_with_teams`
--

DROP TABLE IF EXISTS `relations_with_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relations_with_teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `relations_id` int(11) NOT NULL,
  `teams_id` int(11) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `relation_fk_idx` (`relations_id`),
  KEY `team_fk_idx` (`teams_id`),
  CONSTRAINT `relation_fk` FOREIGN KEY (`relations_id`) REFERENCES `relations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `team_fk` FOREIGN KEY (`teams_id`) REFERENCES `teams` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relations_with_teams`
--

LOCK TABLES `relations_with_teams` WRITE;
/*!40000 ALTER TABLE `relations_with_teams` DISABLE KEYS */;
INSERT INTO `relations_with_teams` VALUES (2,52,1,'2018-08-08 07:46:57','127.0.0.1','2018-08-08 07:46:57','127.0.0.1'),(3,94,25,'2018-08-13 09:51:47','127.0.0.1','2018-08-13 09:51:47','127.0.0.1'),(4,105,1,'2018-08-15 08:32:13','127.0.0.1','2018-08-15 08:32:13','127.0.0.1');
/*!40000 ALTER TABLE `relations_with_teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` longtext,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (9,'17b6e95e-96fe-11e8-99ba-8e9c42f3e967','City administration',NULL,NULL,'2018-07-26 16:52:56',NULL,'2018-07-26 16:52:56',NULL),(10,'61aedaf2-96fe-11e8-99ba-8e9c42f3e967','Application administration',NULL,NULL,'2018-07-26 16:53:11',NULL,'2018-07-26 16:53:11',NULL),(11,'667ff766-96fe-11e8-99ba-8e9c42f3e967','Neighborhood team',NULL,NULL,'2018-07-26 16:53:20',NULL,'2018-07-26 16:53:20',NULL),(12,'716a38bd-96fe-11e8-99ba-8e9c42f3e967','Participant',NULL,NULL,'2018-07-26 16:53:33',NULL,'2018-07-26 16:53:33',NULL),(13,'68e9b451-8a96-431f-83a2-15b660589364','Task owner','The person responsible for the details, the quality and acceptance of the task',NULL,'2018-08-16 10:05:57','127.0.0.1','2018-08-16 10:05:57','127.0.0.1');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_with_privileges`
--

DROP TABLE IF EXISTS `roles_with_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles_with_privileges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roles_id` int(11) NOT NULL,
  `privileges_id` int(11) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_roles_with_privileges_privileges1_idx` (`privileges_id`),
  KEY `fk_roles_with_privileges_roles1_idx` (`roles_id`),
  CONSTRAINT `fk_roles_with_privileges_privileges1` FOREIGN KEY (`privileges_id`) REFERENCES `privileges` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_roles_with_privileges_roles1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_with_privileges`
--

LOCK TABLES `roles_with_privileges` WRITE;
/*!40000 ALTER TABLE `roles_with_privileges` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles_with_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `displayOrder` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `creationDate_UNIQUE` (`creationDate`),
  UNIQUE KEY `modificationDate_UNIQUE` (`modificationDate`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (30,'c7bc99c3-46eb-44a8-8b19-6fff108ece48',100,'Registered',NULL,NULL,'2018-07-28 13:00:47',NULL,'2018-07-28 13:00:47',NULL),(31,'b21927a9-96fe-11e8-99ba-8e9c42f3e967',200,'Assigned',NULL,NULL,'2018-07-28 13:01:00',NULL,'2018-07-28 13:01:00',NULL),(32,'b69ba2aa-96fe-11e8-99ba-8e9c42f3e967',400,'Completed',NULL,NULL,'2018-07-28 13:01:08',NULL,'2018-07-28 13:01:08',NULL),(33,'bd612f02-96fe-11e8-99ba-8e9c42f3e967',500,'Pending for approval',NULL,NULL,'2018-07-28 13:01:11',NULL,'2018-07-28 13:01:11',NULL),(34,'c3914aa6-96fe-11e8-99ba-8e9c42f3e967',600,'Approved',NULL,NULL,'2018-07-28 13:01:15',NULL,'2018-07-28 13:01:15',NULL),(35,'52d68b34-9947-11e8-99ba-8e9c42f3e967',300,'In progress',NULL,NULL,'2018-08-06 09:07:38',NULL,'2018-08-06 09:07:38',NULL),(47,'dee3a4d3-9ba1-11e8-99ba-8e9c42f3e967',350,'Delayed',NULL,NULL,'2018-08-09 09:00:46',NULL,'2018-08-09 09:00:46',NULL),(48,'f27eb37f-9ba1-11e8-99ba-8e9c42f3e967',700,'Rejected',NULL,NULL,'2018-08-09 09:01:17',NULL,'2018-08-09 09:01:17',NULL);
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_flows`
--

DROP TABLE IF EXISTS `status_flows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_flows` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_uuid` varchar(45) NOT NULL,
  `status_uuid1` varchar(45) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_status_flows_status_uuidx` (`status_uuid`),
  KEY `fk_status_flows_status1_uuidx` (`status_uuid1`),
  CONSTRAINT `fk_status_flows_status` FOREIGN KEY (`status_uuid`) REFERENCES `status` (`uuid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_status_flows_status1` FOREIGN KEY (`status_uuid1`) REFERENCES `status` (`uuid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_flows`
--

LOCK TABLES `status_flows` WRITE;
/*!40000 ALTER TABLE `status_flows` DISABLE KEYS */;
INSERT INTO `status_flows` VALUES (1,'c7bc99c3-46eb-44a8-8b19-6fff108ece48','b21927a9-96fe-11e8-99ba-8e9c42f3e967','2018-08-09 09:02:25',NULL,'2018-08-09 09:02:25',NULL),(2,'b21927a9-96fe-11e8-99ba-8e9c42f3e967','52d68b34-9947-11e8-99ba-8e9c42f3e967','2018-08-09 09:02:52',NULL,'2018-08-09 09:02:52',NULL),(3,'52d68b34-9947-11e8-99ba-8e9c42f3e967','b69ba2aa-96fe-11e8-99ba-8e9c42f3e967','2018-08-09 09:03:35',NULL,'2018-08-09 09:03:35',NULL),(4,'b69ba2aa-96fe-11e8-99ba-8e9c42f3e967','bd612f02-96fe-11e8-99ba-8e9c42f3e967','2018-08-09 09:04:41',NULL,'2018-08-09 09:04:41',NULL),(5,'bd612f02-96fe-11e8-99ba-8e9c42f3e967','c3914aa6-96fe-11e8-99ba-8e9c42f3e967','2018-08-09 09:04:41',NULL,'2018-08-09 09:04:41',NULL),(6,'bd612f02-96fe-11e8-99ba-8e9c42f3e967','f27eb37f-9ba1-11e8-99ba-8e9c42f3e967','2018-08-09 09:04:41',NULL,'2018-08-09 09:04:41',NULL),(7,'f27eb37f-9ba1-11e8-99ba-8e9c42f3e967','b21927a9-96fe-11e8-99ba-8e9c42f3e967','2018-08-09 09:04:41',NULL,'2018-08-09 09:04:41',NULL),(8,'52d68b34-9947-11e8-99ba-8e9c42f3e967','dee3a4d3-9ba1-11e8-99ba-8e9c42f3e967','2018-08-09 09:26:38',NULL,'2018-08-09 09:26:38',NULL),(9,'dee3a4d3-9ba1-11e8-99ba-8e9c42f3e967','b69ba2aa-96fe-11e8-99ba-8e9c42f3e967','2018-08-09 09:31:32',NULL,'2018-08-09 09:31:32',NULL);
/*!40000 ALTER TABLE `status_flows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `relations_id` int(11) DEFAULT '0',
  `locations_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(255) NOT NULL,
  `value_sc` double NOT NULL DEFAULT '0',
  `locationDescription` varchar(255) DEFAULT NULL,
  `phonenumber` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `effort` int(11) NOT NULL DEFAULT '0',
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `json` json DEFAULT NULL,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_tasks_locations1_idx` (`locations_id`),
  CONSTRAINT `fk_tasks_locations1` FOREIGN KEY (`locations_id`) REFERENCES `locations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'d1fd18ec-ef1c-4808-b184-97f32b302dd9',NULL,1,'Gardening','string',10,'','0123456789','task.owner@taeam.com','2018-08-09 09:13:32','2018-08-09 09:13:32',0,'2018-08-09 09:26:17',NULL,'2018-08-09 09:26:17',NULL,NULL),(4,'fd0f2fbf-aac4-47f9-af82-fb7af2b15fb1',NULL,1,'Driving','Lorem ipsum',10,NULL,'0123456789','task.owner@taeam.com',NULL,NULL,0,'2018-08-10 11:54:30',NULL,'2018-08-10 11:54:30',NULL,NULL),(5,'b0eb00b8-2aea-4790-b34c-55f9c509131d',57,1,'Daycare','Lorem ipsum',40,NULL,'0123456789','task.owner@taeam.com',NULL,NULL,0,'2018-08-10 11:55:07',NULL,'2018-08-10 11:55:07',NULL,NULL),(6,'4dbf14c9-bfa2-4f89-93aa-db3ef21044f1',57,1,'Teaching','Lorem ipsum',60,NULL,'0123456789','task.owner@taeam.com',NULL,NULL,0,'2018-08-10 11:55:21',NULL,'2018-08-10 11:55:21',NULL,NULL),(7,'8000a5ca-d8c4-4623-88b8-52210c6f8f3c',57,1,'Healing','Lorem ipsum',90,NULL,'0123456789','task.owner@taeam.com',NULL,NULL,0,'2018-08-10 11:55:30',NULL,'2018-08-10 11:55:30',NULL,NULL),(8,'e40f7e2b-38eb-4900-adaf-eb4826c3f1fb',57,1,'string','string',0,'string','string','string','2018-08-11 10:33:58','2018-08-11 10:33:58',0,'2018-08-11 10:44:30',NULL,'2018-08-11 10:44:30',NULL,NULL),(9,'079df166-8672-4499-a2ef-5a6bb8c517d0',57,1,'string','string',0,'string','string','string','2018-08-11 10:33:58','2018-08-11 10:33:58',0,'2018-08-11 10:48:30',NULL,'2018-08-11 10:48:30',NULL,NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_with_actions`
--

DROP TABLE IF EXISTS `tasks_with_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks_with_actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_id` int(11) NOT NULL,
  `actions_id` int(11) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tasks_with_actions_tasks1_idx1` (`tasks_id`),
  KEY `fk_tasks_with_actions_actions1_idx1` (`actions_id`),
  CONSTRAINT `fk_tasks_with_actions_actions1` FOREIGN KEY (`actions_id`) REFERENCES `actions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_with_actions_tasks1` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_with_actions`
--

LOCK TABLES `tasks_with_actions` WRITE;
/*!40000 ALTER TABLE `tasks_with_actions` DISABLE KEYS */;
INSERT INTO `tasks_with_actions` VALUES (1,1,1,'2018-08-10 15:10:26',NULL,'2018-08-10 15:10:26',NULL),(2,1,2,'2018-08-10 15:10:26',NULL,'2018-08-10 15:10:26',NULL);
/*!40000 ALTER TABLE `tasks_with_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_with_skills`
--

DROP TABLE IF EXISTS `tasks_with_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks_with_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `skills_id` int(11) NOT NULL,
  `tasks_id` int(11) NOT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tasks_with_skills_skills1_idx` (`skills_id`),
  KEY `fk_tasks_with_skills_tasks1_idx` (`tasks_id`),
  CONSTRAINT `fk_tasks_with_skills_skills1` FOREIGN KEY (`skills_id`) REFERENCES `skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_with_skills_tasks1` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_with_skills`
--

LOCK TABLES `tasks_with_skills` WRITE;
/*!40000 ALTER TABLE `tasks_with_skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks_with_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_with_status`
--

DROP TABLE IF EXISTS `tasks_with_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks_with_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `description` longtext,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_actions_with_status_status1_idx` (`status_id`),
  KEY `fk_tasks_with_status_tasks1_idx` (`tasks_id`),
  CONSTRAINT `fk_actions_with_status_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_with_status_tasks1` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_with_status`
--

LOCK TABLES `tasks_with_status` WRITE;
/*!40000 ALTER TABLE `tasks_with_status` DISABLE KEYS */;
INSERT INTO `tasks_with_status` VALUES (1,1,34,NULL,NULL,'2018-08-11 07:14:14','127.0.0.1','2018-08-11 07:14:14','127.0.0.1');
/*!40000 ALTER TABLE `tasks_with_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` longtext,
  `json` json DEFAULT NULL,
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `modificationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'252e7c67-b931-4893-aa89-c8de614ff82c','Wijkteam Zuid',NULL,NULL,'2018-08-08 07:44:53','127.0.0.1','2018-08-08 07:44:53','127.0.0.1'),(25,'6b8c7994-fe10-4064-a5c4-ae86316ab9d6','Team South',NULL,NULL,'2018-08-13 09:51:48','127.0.0.1','2018-08-13 09:51:48','127.0.0.1');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `relations_id` int(11) NOT NULL,
  `tasks_id` int(11) NOT NULL,
  `amount_euro` double NOT NULL DEFAULT '0',
  `amount_sc` double NOT NULL DEFAULT '0',
  `creationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(255) DEFAULT NULL,
  `description` longtext,
  `json` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `fk_transactions_relations1_idx` (`relations_id`),
  KEY `fk_transactions_tasks1_idx` (`tasks_id`),
  CONSTRAINT `fk_transactions_relations1` FOREIGN KEY (`relations_id`) REFERENCES `relations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_transactions_tasks1` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `security`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `security` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `security`;

--
-- Table structure for table `ACL`
--

DROP TABLE IF EXISTS `ACL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ACL` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ACL`
--

LOCK TABLES `ACL` WRITE;
/*!40000 ALTER TABLE `ACL` DISABLE KEYS */;
/*!40000 ALTER TABLE `ACL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AccessToken`
--

DROP TABLE IF EXISTS `AccessToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AccessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `scopes` text,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccessToken`
--

LOCK TABLES `AccessToken` WRITE;
/*!40000 ALTER TABLE `AccessToken` DISABLE KEYS */;
INSERT INTO `AccessToken` VALUES ('0POtXw1Y0ZIRZk1JlKwlodqsogN7aZ9XGMtEKM729e5FdIO2BPHylZ42VmtJmCHb',1209600,NULL,'2018-08-10 10:24:40',52),('1xerWEy2OchHCW8qm6xV3FITgGPu2KbW8yVVC3m9Z6hYH8k5MpfQClm3XanWj43N',1209600,NULL,'2018-08-10 09:53:47',52),('29bAet5K2KXZGSQ5aIskA3muFrm0I3F2i9Gsu5wstEXhjph3GuGAcCVq1VLAOAou',1209600,NULL,'2018-08-10 08:44:00',52),('3DH46Twr6TFf6KsRyCrei9wcnVDODhnZ9PFiEDnpkOWsH0HGoU36qAKTmvI00x4z',1209600,NULL,'2018-08-10 10:20:20',52),('3jfDgcKIOWAp5FA0k2SUGh7ADCGgTuJWAH4abe7Q6IjJNGPFPeDLCkqZ6whASABU',1209600,NULL,'2018-08-10 10:13:02',52),('7JDR6KCkmgWCdhSYOVCgV1nxLovAJL4WxsRkP1BkMIdptFrKzw5vWsh0GCH1kEgz',1209600,NULL,'2018-08-10 10:12:33',52),('aTPpOyCVtQfXGioEYXL5OKRZK8hkowjbMqsTA37kc38ZrJcgkEuik0mUaEE6Ix86',1209600,NULL,'2018-08-10 10:10:30',52),('CfB4IsHqB9VkxStudjGc9gG1GHTZ8bCGfKGChnuIGaixV3jW6AJw6mtIm4seBfwr',1209600,NULL,'2018-08-10 10:23:39',52),('CIHtGmiYvOt2m308YHgKY4AcHHS2HMC4lEVWojZvDiCsELeMG0D5CFQOBwfxXofj',1209600,NULL,'2018-08-10 09:30:12',52),('CSFFB0wAByI6WbHHwcpMFBmlxzEH5WGAGLKIeXZ0AYYEyeQun1Zwr7Cgr5jqmfuY',1209600,NULL,'2018-08-10 10:17:52',52),('ehPauIkPjAVJ9jBFcCJ0QHXs25bUMveG4wLFjnqwOx4QYgwzwzd9ykFijxrkQvYh',1209600,NULL,'2018-08-12 07:37:11',52),('eyxa1VRybm5A8zReHS9zwRuxAdPBx5XbvnI0uatrz1x0oG91LQ7aEsD3OH6vpjED',900,'[\"reset-password\"]','2018-08-08 09:18:24',56),('GA99vXdG3ImwHdlkRfSZhKJ84VPRVaykYPGBbIqpNcKkZ2xBB3ZY7Fs6WC3nxbbI',1209600,NULL,'2018-08-10 11:31:04',52),('GXebHJeAeMYGkXEDqWdsIx3ma14JgsnVxn7UDONjp1lhUqwzj6wsHKkoNj5qSjfk',1209600,NULL,'2018-08-09 07:46:19',52),('H86P6xQVRPOreL153O3gagQicW2hKUBnVlIvmOHzlExon9DtCPO0Sw4VyGSAANf6',1209600,NULL,'2018-08-11 08:36:44',52),('i0bGtthxkqeSVwAdMBGjObMLlm8pXDp2t5jKK89dcxKpsyFGyQ4RCWYsJjsQfGLh',1209600,NULL,'2018-08-13 07:06:11',52),('Id5ZK91Ma564QWcYkqm0F4XNPBAC0EVjLahODi55RgSBk3STFg454iUMa4VWNKYA',1209600,NULL,'2018-08-10 08:27:31',52),('iYxboL2xPbYFdlbqhBC3rkJ3I4DRdh6vKglN5d7ybnnEEFjUORVjQpvdxtPWhyVs',1209600,NULL,'2018-08-11 08:26:10',52),('jdoc3MnuJF9TjARu74CSyVla6ZYGYVNgapb9Z8ITwXTyrcDx4Y2yXvEOPm43FYna',1209600,NULL,'2018-08-15 08:39:21',105),('kbbB3rLAWADuUv39L3ZM726FRxYaUhJCfm9NYAxDBhUQBvBkEzKDzlpcZGS3nxGB',1209600,NULL,'2018-08-10 10:23:48',52),('L6PLU54lxSqLpEJlgxdMNDWmx4tYugEWMP1r2CMaNr0XmIiYbXhetEqY1oV4p2rB',1209600,NULL,'2018-08-10 10:09:50',52),('mHFa7kGoR3P59Bbb8HGoAfyeiQmTaSrnY5lKxbB4DAKPVUYtWHwPM21K262TYCUY',1209600,NULL,'2018-08-10 09:46:52',52),('qGhRUOD2BLYwTbkn8dcFko8dAZnUC6JbdPK1JYd1Eq1o8Ymj6dovikJtgBuL0lVW',900,'[\"reset-password\"]','2018-08-08 17:06:19',52),('qIKYwLwpcTE6oRrgq0IOrBHRQPBnptAHubwAfV4ziC1FVuDoXSQL3lKUvAGRIZqx',1209600,NULL,'2018-08-09 09:22:45',52),('qMo3NXQaarxAWszZ1A8MW56dO94I9gHxmfe8hfVHpZLOijZcbpAcUlRHJATnk06k',900,'[\"reset-password\"]','2018-08-15 08:37:52',105),('qUaCRvEs9gtskrOPuTeuNnAKye4C8uRpbeqj7FbsLMFxK9d1UaxmVLjwxINCrWNf',1209600,NULL,'2018-08-10 09:23:05',52),('rCGHF85zhQkeNo9hm6SMoqGcqacwVAjD3PFQpAZSvobQPqi2p4D68tn2nCZ8Mz7Y',1209600,NULL,'2018-08-10 10:13:11',52),('SVmgaTRG6xIP6js2lnAL56dmR4KxII9jUtjgxRvCeDmOaD2sMODmXIV1DifdFBkI',1209600,NULL,'2018-08-09 09:23:39',52),('UAcgeHJItmGbommikBI848yHB7BFQ3Xup4RzncHkaA9vQ81E8olbrlJmZb7YNGFo',1209600,NULL,'2018-08-10 10:20:04',52),('vrBMMkLKId0kgrE0XXUTnMUzxefE3fVkbNVBDXXKnfPRqb76LWxB2lxGRLA1jxgC',1209600,NULL,'2018-08-10 10:27:09',52),('WEN9sivWQe1hO3oOIqQ9vnE94xqzYbUkn0YZbe0WURAGq6SRep18GTmFn1vQQbLC',1209600,NULL,'2018-08-10 10:08:49',52),('zE8BMKcMOUq9ZRXC0A0Q3uPtSZocDxLm2CRbjkOaJwCqkSnkB90gJygncCckg0fB',1209600,NULL,'2018-08-11 08:25:15',52);
/*!40000 ALTER TABLE `AccessToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Role` (
  `id` int(10) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoleMapping`
--

DROP TABLE IF EXISTS `RoleMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RoleMapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `principalId` (`principalId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoleMapping`
--

LOCK TABLES `RoleMapping` WRITE;
/*!40000 ALTER TABLE `RoleMapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `RoleMapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int(10) NOT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(3) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,NULL,'theotheu','111111','theo.theunissen@gmail.com',NULL,NULL),(2,'string','string','string','string',0,'string'),(3,NULL,'theotheu','111111','theo.theunissen@gmail.com',NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `socialcoin`
--

USE `socialcoin`;

--
-- Final view structure for view `participants`
--

/*!50001 DROP VIEW IF EXISTS `participants`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`theotheu`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `participants` AS select `r`.`id` AS `id`,`r`.`locations_id` AS `locations_id`,`r`.`firstname` AS `firstname`,`r`.`prefix` AS `prefix`,`r`.`lastname` AS `lastname`,concat(`r`.`firstname`,' ',`r`.`prefix`,' ',`r`.`lastname`) AS `participant`,`r`.`date_of_birth` AS `date_of_birth`,`r`.`phonenumber` AS `phonenumber`,`r`.`email` AS `email`,`r`.`description` AS `description`,`r`.`username` AS `username`,`r`.`creationDate` AS `creationDate`,`r`.`createdBy` AS `createdBy`,`r`.`modificationDate` AS `modificationDate`,`r`.`modifiedBy` AS `modifiedBy`,`t`.`id` AS `teamId`,`t`.`name` AS `teamName`,(select sum(`debts`.`debt_lc`) from `debts` where (`debts`.`relations_id` = `r`.`id`)) AS `debt` from (((`relations` `r` join `relations_with_roles` `rwr`) left join `relations_with_teams` `rwt` on((`r`.`id` = `rwt`.`relations_id`))) left join `teams` `t` on((`t`.`id` = `rwt`.`teams_id`))) where ((`r`.`id` = `rwr`.`relations_id`) and (`rwr`.`roles_id` = 12)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Current Database: `security`
--

USE `security`;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-19  9:08:12
