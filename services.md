GET
/api/v1/vr-hotel/services
Get Services


Get all services

Parameters
Cancel
Name	Description
x-property-id
integer | (integer | null)
(header)
13
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://travel.link360.vn/api/v1/vr-hotel/services' \
  -H 'accept: application/json' \
  -H 'x-property-id: 13' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzAyMDA5MjQsInN1YiI6IjI2In0.OcZehfw2JmREV2dS1FtOwF0BBXpVhyTyYuY999aSi7I'
Request URL
https://travel.link360.vn/api/v1/vr-hotel/services
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 3,
    "tenant_id": 6,
    "property_id": 13,
    "code": "SV01",
    "service_type": "room_service",
    "availability": null,
    "price_info": null,
    "vr_link": "https://phoenix.vt360.vn/#media-name=Ph%C3%B2ng%20H%E1%BB%8Dp%20%26%20H%E1%BB%99i%20Ngh%E1%BB%8B&yaw=-22.71&pitch=-11.68&fov=110.00",
    "booking_url": null,
    "status": "active",
    "translations": {
      "en": {
        "locale": "en",
        "name": "MEETING ROOM",
        "description": "The meeting room at Phoenix Hotel Vung Tau is thoughtfully designed to meet the needs of business meetings, small conferences, training sessions, and professional gatherings. With a flexible layout, the space can be arranged to suit various purposes, from internal meetings and workshops to presentations and business discussions.\n\nThe room features a clean and well-organized design, creating a professional yet comfortable environment that encourages focus and productivity. Essential meeting equipment is provided to support presentations and discussions, while carefully planned lighting and a quiet setting help maintain privacy and concentration throughout the event.\n\nConveniently located within the hotel, the meeting room allows business travelers to seamlessly combine accommodation, work, and relaxation in one place. Supported by a dedicated hotel team ready to assist with setup and coordination, the meeting room ensures smooth and efficient events. It is an ideal choice for companies and organizations seeking a practical, accessible, and comfortable meeting venue in Vung Tau City."
      },
      "vi": {
        "locale": "vi",
        "name": "PHÒNG HỌP",
        "description": "Phòng họp tại Phoenix Hotel Vũng Tàu được thiết kế nhằm đáp ứng nhu cầu tổ chức các buổi họp, hội thảo quy mô nhỏ, gặp gỡ đối tác và làm việc nhóm trong không gian yên tĩnh, chuyên nghiệp. Với cách bố trí linh hoạt, phòng họp có thể dễ dàng điều chỉnh theo từng mục đích sử dụng khác nhau, từ họp nội bộ, đào tạo nhân sự đến các buổi thuyết trình hay ký kết hợp tác.\n\nKhông gian phòng được thiết kế gọn gàng, trang nhã, tạo cảm giác tập trung và thoải mái trong suốt thời gian làm việc. Hệ thống trang thiết bị cơ bản phục vụ hội họp được chuẩn bị đầy đủ, hỗ trợ hiệu quả cho các hoạt động trình bày, trao đổi và thảo luận. Ánh sáng được bố trí hợp lý, kết hợp với không gian kín đáo, giúp đảm bảo sự riêng tư và tính chuyên nghiệp cho mỗi sự kiện.\n\nNằm ngay trong khuôn viên khách sạn, phòng họp mang đến sự thuận tiện tối đa cho khách công tác khi có thể kết hợp giữa lưu trú, làm việc và nghỉ ngơi trong cùng một địa điểm. Đội ngũ nhân viên của Phoenix Hotel luôn sẵn sàng hỗ trợ trong suốt quá trình tổ chức, góp phần mang đến một buổi họp diễn ra suôn sẻ và hiệu quả. Phòng họp là lựa chọn phù hợp cho các doanh nghiệp và tổ chức đang tìm kiếm một không gian làm việc tiện nghi, tiết kiệm và dễ tiếp cận tại thành phố biển Vũng Tàu."
      }
    },
    "media": [
      {
        "media_id": 168,
        "is_vr360": false,
        "is_primary": true,
        "sort_order": 100
      }
    ],
    "display_order": 0,
    "created_at": "2026-01-22T02:43:08",
    "updated_at": "2026-01-27T03:08:29"
  }
]
Response headers
 cache-control: no-cache,no-store,must-revalidate 
 connection: keep-alive 
 content-length: 3353 
 content-type: application/json 
 date: Tue,27 Jan 2026 10:32:33 GMT 
 expires: 0 
 pragma: no-cache 
 server: nginx/1.18.0 (Ubuntu) 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "tenant_id": 0,
    "property_id": 0,
    "code": "string",
    "service_type": "string",
    "availability": "string",
    "price_info": "string",
    "vr_link": "string",
    "booking_url": "string",
    "status": "string",
    "translations": {
      "additionalProp1": {
        "locale": "string",
        "name": "string",
        "description": "string"
      },
      "additionalProp2": {
        "locale": "string",
        "name": "string",
        "description": "string"
      },
      "additionalProp3": {
        "locale": "string",
        "name": "string",
        "description": "string"
      }
    },
    "media": [
      {
        "media_id": 0,
        "is_vr360": false,
        "is_primary": false,
        "sort_order": 100
      }
    ],
    "display_order": 0,
    "created_at": "2026-01-27T10:31:21.862Z",
    "updated_at": "2026-01-27T10:31:21.862Z"
  }
]
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}