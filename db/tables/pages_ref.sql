-- pages_ref: one record per page, scoped to a project via Project_Id.
-- Page_Meta / Page_Components / Page_Settings store the page document as JSON; pages are looked up by Page_Id or Page_Slug.
-- Page_Active is a soft-delete flag (1 = live); the trigger stamps the Created_UTC_DateTime audit column on insert.

CREATE TABLE `app_db`.`pages_ref`  (
  `Page_Id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Unique key value ID used to identify each individual record in this table.',
  `Project_Id` int(0) UNSIGNED NOT NULL COMMENT '',
  `Page_Slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '',
  `Page_URL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '',
  `Page_Meta` json DEFAULT NULL COMMENT 'A JSON field containing page metadata.',
  `Page_Components` json DEFAULT NULL COMMENT 'A JSON field containing page components.',
  `Page_Settings` json DEFAULT NULL COMMENT 'A JSON field containing page settings.',
  `Page_Active` tinyint UNSIGNED DEFAULT '1',
  `Created_UTC_DateTime` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'The UTC DateTime the record was inserted/saved.',
  PRIMARY KEY (`Page_Id`) USING BTREE,
  KEY `Page_Slug_Index` (`Page_Slug`) USING BTREE,
  KEY `Created_UTC_DateTime_Index` (`Created_UTC_DateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=840100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Reference: All pages.';

CREATE TRIGGER `pages_ref_before_insert_trigger` BEFORE INSERT ON `pages_ref` FOR EACH ROW BEGIN


-- pages_ref_before_insert_trigger


SET NEW.Created_UTC_DateTime = UTC_TIMESTAMP(6) ; -- set only on insert

END;
