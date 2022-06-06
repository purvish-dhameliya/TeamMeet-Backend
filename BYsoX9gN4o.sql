-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: remotemysql.com
-- Generation Time: Oct 01, 2021 at 03:49 AM
-- Server version: 8.0.13-4
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `BYsoX9gN4o`
--

-- --------------------------------------------------------

--
-- Table structure for table `inquiry_master`
--

CREATE TABLE `inquiry_master` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `msg` longtext COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `inquiry_master`
--

INSERT INTO `inquiry_master` (`id`, `name`, `email`, `subject`, `msg`) VALUES
(9, 'jensh', 'djdhananijenish777@outlook.com', 'final testing', 'teammeet contact us testing'),
(10, 'Jenish dhanani', 'djdhananijenish777@gmail.com', 'Teammeet', 'Hello developers....'),
(11, 'jenish', 'jbkarp2017@gmail.com', 'hello', 'hello all i changed review_master to inquiry_master.\ni just testing.'),
(12, 'Harshit', 'harshitgajipara00@gmail.com', 'About website related', 'This website is very good. This is very useful website who is want create prive meetings and so on like Zoom and Google meet. Features is also very  excellent .'),
(13, 'jenish', 'djdhananijenish777@gmail.com', 'hello ', 'hello'),
(14, 'Jenish dhanani', 'djdhananijenish777@gmail.com', 'Shut down team meet', 'Our project exam goes fucked up, so now please developers shut down this site....');

-- --------------------------------------------------------

--
-- Table structure for table `otp_master`
--

CREATE TABLE `otp_master` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `otp` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `profile_master`
--

CREATE TABLE `profile_master` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `picUrl` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `profile_master`
--

INSERT INTO `profile_master` (`id`, `uid`, `picUrl`) VALUES
(75, 153, '/uploads/213937-153.jpg'),
(77, 155, '/uploads/892836-155.jpg'),
(78, 156, '/uploads/398058-156.jpg'),
(79, 157, '/uploads/653962-157.jpg'),
(80, 158, '/uploads/267765-158.jpg'),
(81, 159, '/uploads/265292-159.jpg'),
(82, 160, '/uploads/783270-160.png'),
(83, 161, '/uploads/172675-161.jpg'),
(84, 164, '/uploads/273141-164.jpg'),
(86, 166, '/uploads/514329-166.jpg'),
(87, 167, '/uploads/313924-167.png'),
(90, 171, '/uploads/952674-171.jpg'),
(93, 174, '/uploads/477972-174.png'),
(104, 188, '/uploads/342215-188.jpg'),
(105, 189, '/uploads/926903-189.jpg'),
(108, 192, '/uploads/705113-192.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `register_master`
--

CREATE TABLE `register_master` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `email` longtext NOT NULL,
  `pass` varchar(255) NOT NULL,
  `isverified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `register_master`
--

INSERT INTO `register_master` (`id`, `fname`, `lname`, `mobile`, `email`, `pass`, `isverified`) VALUES
(153, 'Rahul', 'Ghoghari', '9484825010', 'rahulghoghari2757@gmail.com', '$2b$10$GQHXrALJq30/.97mIAZgEeuayugwoy5SMJkv2tbt1ZRt3i9TI5N/2', 1),
(155, 'sumit', 'bharodiya', '7201813023', 'sumitbharodiya76@gmail.com', '$2b$10$gMpZIP7AlZ2LAkotsSvByOCHH4JExz.eAbkobnSTnwQcZ5AlBzP1a', 1),
(156, 'jd', 'test', '9712294506', 'jbkarp2017@gmail.com', '$2b$10$H1Gq/6KG/Mwl1hzlhZh96eJ6zVsIy45OKjIVwQdddxEZWo/CdAtGG', 1),
(157, 'Keyur', 'Dhaduk', '9824948013', 'dkinfotech2401@gmail.com', '$2b$10$Qskb2XOSqeif59ocfqoxmuOVIE/E6KhOm.rX4L108qSLWlpLpq35e', 1),
(158, 'Parth', 'Bhanderi', '8469022966', 'parthbhanderi16@gmail.com', '$2b$10$K75dCRXOi2G.NHivPr2qlOEnF692oSEkyQ3Kl/5k.hCftostAEajm', 1),
(159, 'Arpit', 'Kyada', '8469707178', 'akkyada@gmail.com', '$2b$10$Xl0GPY1UhDy2R9YPWjoXJ.kvOnpLokDb3Nc.6Tz.hSqMdLU7IgWnS', 1),
(160, 'jenish', 'dhanani', '9712294506', 'djdhananijenish777@gmail.com', '$2b$10$juvmIvNfYyovUz310ZZN.uA4wdIbJKO7LKH6YXhNuXiqfcfVZMymO', 1),
(161, 'Harshit', 'Golakiya', '8866667762', 'harshitgolakiya1@gmail.com', '$2b$10$xw8VCW.YLqcRodZfOLac5O2.yLd1VPu94R3BvRZO0DFybSW3.AcJ2', 1),
(164, 'Dhruvit', 'Patel', '7984870403', 'dhruvitpatel560@gmail.com', '$2b$10$b88MNnwmgOLvRBT.rGa29.0/UDCtqIARLQDFS7ug/HmP9ZCMi/rMm', 1),
(166, 'akshit', 'limbani', '9624541256', 'akshitlimbani412001@gmail.com', '$2b$10$MQCis1jWUODZrspQUsPGw.hxeTjbKD4oZ0b1ghNljnEb5VlsehmGG', 1),
(167, 'Harshit', 'Gajipara', '7096802979', 'harshitgajipara00@gmail.com', '$2b$10$FzAN/Q4ruCvpqZNgQzRou.IoM74Ej7xfyeEKNEcIevT1saSrjRn4m', 1),
(171, 'Purvish', 'Dhameliya', '9106163772', 'purvishdhameliya37@gmail.com', '$2b$10$07QTkC.jcqkfc2aKcDiR4.1wxF6078f8wDFK45GbmfHhuQqrCc2PW', 1),
(174, 'Kauahik', 'DHAMELIYA', '7698232631', 'ckpatel693@gmail.com', '$2b$10$TR4sAx4lYiXgGN1gOj.0u.i97uUb5p2c5BP1pZy213jbFfkFJ3kK.', 1),
(177, 'purvish', 'dhameliya', '9106163772', 'pbdhameliya37@gmail.com', '$2b$10$m12djF0ANOo45nN0lUslSecWEX3tQxZQ2fzMRUsWHvQ2i6BToCaFa', 0),
(188, 'Dax', 'Poshiya', '8153063575', 'dposhiya116@gmail.com', '$2b$10$d6Bdb7958wQshyU7mSIBM.UMSQ1KhwxTdEUzl07khUzQfTANLEXa.', 0),
(189, 'Yash', 'Sherpura', '9512681119', 'sherpura.yash@gmail.com', '$2b$10$jyZug3.eXZrqoHom4AwmUeescA/pMQqvFzFhABKZq7omQVLy80wfi', 1),
(192, 'Rahullll', 'Ghoghari', '8564257626', 'rahulghoghari1213@gmail.com', '$2b$10$n76RZLekzo9x7OXxS1szE.ECkeqKnSks4qenSD4wV./Mgh/a3QTp2', 1),
(193, 'Chirag', 'Nabhoya', '6353336374', 'chiragnabhoya2506@gmail.com', '$2b$10$dc4zU0YsOqHQ95AsdA6uXOKw0o5IwsEPpknliNGEpHhsqX2.4u8XW', 1),
(194, 'Ashok', 'Ghoghari', '9978805511', 'ashokghoghari@gmail.com', '$2b$10$R/2Jq7KQ/1651Smx5lNXnOh.mz5HZv4B6bO9ZObAg.Ha5CSHTpFMe', 0);

-- --------------------------------------------------------

--
-- Table structure for table `room_master`
--

CREATE TABLE `room_master` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `roomid` int(11) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `connectedUsers` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inquiry_master`
--
ALTER TABLE `inquiry_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otp_master`
--
ALTER TABLE `otp_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `profile_master`
--
ALTER TABLE `profile_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- Indexes for table `register_master`
--
ALTER TABLE `register_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_master`
--
ALTER TABLE `room_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inquiry_master`
--
ALTER TABLE `inquiry_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `otp_master`
--
ALTER TABLE `otp_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `profile_master`
--
ALTER TABLE `profile_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `register_master`
--
ALTER TABLE `register_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `room_master`
--
ALTER TABLE `room_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `otp_master`
--
ALTER TABLE `otp_master`
  ADD CONSTRAINT `otp_master_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `register_master` (`id`);

--
-- Constraints for table `profile_master`
--
ALTER TABLE `profile_master`
  ADD CONSTRAINT `profile_master_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `register_master` (`id`);

--
-- Constraints for table `room_master`
--
ALTER TABLE `room_master`
  ADD CONSTRAINT `room_master_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `register_master` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
