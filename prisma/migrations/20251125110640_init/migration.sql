/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isGuest` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `selectedLanguage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactUs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryOrigin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryOriginTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CouponUserUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlavourProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlavourProfileTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NoteTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Refund` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleNotificationPolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpecialOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscribers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Url` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserNotificationDelivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserNotificationPref` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishlistItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NotificationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CampaignTranslation" DROP CONSTRAINT "CampaignTranslation_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."City" DROP CONSTRAINT "City_countryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContentSection" DROP CONSTRAINT "ContentSection_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ContentTranslation" DROP CONSTRAINT "ContentTranslation_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CountryOrigin" DROP CONSTRAINT "CountryOrigin_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CountryOriginTranslation" DROP CONSTRAINT "CountryOriginTranslation_countryOriginId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CouponUserUsage" DROP CONSTRAINT "CouponUserUsage_couponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CouponUserUsage" DROP CONSTRAINT "CouponUserUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Device" DROP CONSTRAINT "Device_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlavourProfile" DROP CONSTRAINT "FlavourProfile_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlavourProfileTranslation" DROP CONSTRAINT "FlavourProfileTranslation_flavourProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NoteTranslation" DROP CONSTRAINT "NoteTranslation_noteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_recipientRoleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotificationChannel" DROP CONSTRAINT "NotificationChannel_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NotificationTranslation" DROP CONSTRAINT "NotificationTranslation_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_billingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_couponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItemTranslation" DROP CONSTRAINT "OrderItemTranslation_orderItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PageTranslation" DROP CONSTRAINT "PageTranslation_pageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_specialOfferId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductNote" DROP CONSTRAINT "ProductNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductNote" DROP CONSTRAINT "ProductNote_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductTranslation" DROP CONSTRAINT "ProductTranslation_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Refund" DROP CONSTRAINT "Refund_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Refund" DROP CONSTRAINT "Refund_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Refund" DROP CONSTRAINT "Refund_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RoleNotificationPolicy" DROP CONSTRAINT "RoleNotificationPolicy_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotificationDelivery" DROP CONSTRAINT "UserNotificationDelivery_userNotificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotificationPref" DROP CONSTRAINT "UserNotificationPref_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WishlistItem" DROP CONSTRAINT "WishlistItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WishlistItem" DROP CONSTRAINT "WishlistItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_NotificationToUser" DROP CONSTRAINT "_NotificationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_NotificationToUser" DROP CONSTRAINT "_NotificationToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "isEmailVerified",
DROP COLUMN "isGuest",
DROP COLUMN "roleId",
DROP COLUMN "selectedLanguage",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."Address";

-- DropTable
DROP TABLE "public"."Campaign";

-- DropTable
DROP TABLE "public"."CampaignTranslation";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."CategoryTranslation";

-- DropTable
DROP TABLE "public"."City";

-- DropTable
DROP TABLE "public"."ContactUs";

-- DropTable
DROP TABLE "public"."ContentSection";

-- DropTable
DROP TABLE "public"."ContentTranslation";

-- DropTable
DROP TABLE "public"."Country";

-- DropTable
DROP TABLE "public"."CountryOrigin";

-- DropTable
DROP TABLE "public"."CountryOriginTranslation";

-- DropTable
DROP TABLE "public"."Coupon";

-- DropTable
DROP TABLE "public"."CouponUserUsage";

-- DropTable
DROP TABLE "public"."Device";

-- DropTable
DROP TABLE "public"."FlavourProfile";

-- DropTable
DROP TABLE "public"."FlavourProfileTranslation";

-- DropTable
DROP TABLE "public"."Invoice";

-- DropTable
DROP TABLE "public"."Note";

-- DropTable
DROP TABLE "public"."NoteTranslation";

-- DropTable
DROP TABLE "public"."Notification";

-- DropTable
DROP TABLE "public"."NotificationChannel";

-- DropTable
DROP TABLE "public"."NotificationTranslation";

-- DropTable
DROP TABLE "public"."Order";

-- DropTable
DROP TABLE "public"."OrderAddress";

-- DropTable
DROP TABLE "public"."OrderItem";

-- DropTable
DROP TABLE "public"."OrderItemTranslation";

-- DropTable
DROP TABLE "public"."Page";

-- DropTable
DROP TABLE "public"."PageTranslation";

-- DropTable
DROP TABLE "public"."Permission";

-- DropTable
DROP TABLE "public"."PlatformSettings";

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."ProductNote";

-- DropTable
DROP TABLE "public"."ProductTranslation";

-- DropTable
DROP TABLE "public"."Refund";

-- DropTable
DROP TABLE "public"."Role";

-- DropTable
DROP TABLE "public"."RoleNotificationPolicy";

-- DropTable
DROP TABLE "public"."RolePermission";

-- DropTable
DROP TABLE "public"."SpecialOffer";

-- DropTable
DROP TABLE "public"."Subscribers";

-- DropTable
DROP TABLE "public"."Url";

-- DropTable
DROP TABLE "public"."UserNotification";

-- DropTable
DROP TABLE "public"."UserNotificationDelivery";

-- DropTable
DROP TABLE "public"."UserNotificationPref";

-- DropTable
DROP TABLE "public"."WishlistItem";

-- DropTable
DROP TABLE "public"."_NotificationToUser";

-- DropEnum
DROP TYPE "public"."CampaignType";

-- DropEnum
DROP TYPE "public"."CouponType";

-- DropEnum
DROP TYPE "public"."InvoiceStatus";

-- DropEnum
DROP TYPE "public"."Language";

-- DropEnum
DROP TYPE "public"."NotificationChannelEnum";

-- DropEnum
DROP TYPE "public"."NotificationEventEnum";

-- DropEnum
DROP TYPE "public"."NotificationTemplate";

-- DropEnum
DROP TYPE "public"."NotificationType";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."PageType";

-- DropEnum
DROP TYPE "public"."RefundStatus";

-- DropEnum
DROP TYPE "public"."RefundTrigger";

-- DropEnum
DROP TYPE "public"."RefundType";

-- DropEnum
DROP TYPE "public"."Status";
