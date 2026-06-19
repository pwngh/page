-- projects_ref: one record per project that owns pages; Project_Id is referenced by pages_ref.
-- Project_Name / Project_Domain / Project_Logo_URL describe the project; lookups by domain use Project_Domain_Index.
-- Project_Active is a soft-delete flag (1 = live); the trigger stamps the Created_UTC_* audit columns on insert.

CREATE TABLE `app_db`.`projects_ref`  (
  `Project_Id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Unique key value ID used to identify each individual record in this table.',
  `Project_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '',
  `Project_Domain` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '',
  `Project_Logo_URL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '',
  `Project_Active` tinyint UNSIGNED DEFAULT '1',
  `Created_UTC_DateTime` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'The UTC DateTime the record was inserted/saved.',
  `Created_UTC_Date` date NULL DEFAULT NULL COMMENT 'The UTC Date the record was inserted/saved.  Created_UTC_DateTime is the source.',
  `Created_UTC_Time` time(6) NULL DEFAULT NULL COMMENT 'The UTC Time the record was inserted/saved.  Created_UTC_DateTime is the source.',
  PRIMARY KEY (`Project_Id`) USING BTREE,
  KEY `Project_Domain_Index` (`Project_Domain`) USING BTREE,
  KEY `Created_UTC_DateTime_Index` (`Created_UTC_DateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=390200 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Reference: All projects.';

CREATE TRIGGER `projects_ref_before_insert_trigger` BEFORE INSERT ON `projects_ref` FOR EACH ROW BEGIN


-- projects_ref_before_insert_trigger


SET NEW.Created_UTC_DateTime = UTC_TIMESTAMP(6) ; -- set only on insert

SET NEW.Created_UTC_Date = CAST(NEW.Created_UTC_DateTime AS DATE) ; -- set only on insert

SET NEW.Created_UTC_Time = CAST(NEW.Created_UTC_DateTime AS TIME) ; -- set only on insert

END;
