# OngoleBulls Dashboard API Endpoints for Postman Testing

## Base URL
```
http://localhost:8080
```
*(Replace with your actual server URL if different)*

---

## 🔵 DASHBOARD ENDPOINTS (`/api/dashboard`)

### 1. Get Dashboard Data
**GET** `/api/dashboard/{userId}`

**Example:**
```
GET http://localhost:8080/api/dashboard/1
```

**Response:** DashboardPayload with metrics, SIP summary, transactions, funds, alerts

---

### 2. Get Asset Allocation
**GET** `/api/dashboard/{userId}/asset-allocation`

**Example:**
```
GET http://localhost:8080/api/dashboard/1/asset-allocation
```

**Response:** List of asset allocation percentages by class

---

### 3. Get User Profile
**GET** `/api/dashboard/{userId}/profile`

**Example:**
```
GET http://localhost:8080/api/dashboard/1/profile
```

**Response:** UserProfileDto with user details

---

### 4. Update User Profile
**PUT** `/api/dashboard/{userId}/profile`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

**Example:**
```
PUT http://localhost:8080/api/dashboard/1/profile
```

---

### 5. Get Transactions
**GET** `/api/dashboard/{userId}/transactions?page=0&size=10`

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 10)

**Example:**
```
GET http://localhost:8080/api/dashboard/1/transactions?page=0&size=10
```

**Response:** Paginated list of TransactionDto

---

### 6. Get Dashboard Metrics
**GET** `/api/dashboard/{userId}/metrics`

**Example:**
```
GET http://localhost:8080/api/dashboard/1/metrics
```

**Response:** DashboardMetricsDto with investment metrics

---

### 7. Get Recent Activity
**GET** `/api/dashboard/{userId}/recent-activity?limit=5`

**Query Parameters:**
- `limit` (default: 5)

**Example:**
```
GET http://localhost:8080/api/dashboard/1/recent-activity?limit=8
```

**Response:** List of ActivityDto

---

### 8. Change Password
**POST** `/api/dashboard/{userId}/change-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Example:**
```
POST http://localhost:8080/api/dashboard/1/change-password
```

**Response:** 200 OK (empty body)

---

## 🟢 ACTION ENDPOINTS (`/api`)

### 9. Create Investment Request
**POST** `/api/investments/request`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "fundName": "Axis Bluechip Fund",
  "amount": 10000
}
```

**Alternative (using schemeName):**
```json
{
  "userId": 1,
  "schemeName": "Axis Bluechip Fund",
  "amount": 10000
}
```

**Example:**
```
POST http://localhost:8080/api/investments/request
```

**Response:** InvestmentRequest object

---

### 10. Create Redemption Request
**POST** `/api/redeem/request`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "fundName": "HDFC Liquid Fund",
  "amount": 5000
}
```

**Alternative (using schemeName):**
```json
{
  "userId": 1,
  "schemeName": "HDFC Liquid Fund",
  "amount": 5000
}
```

**Example:**
```
POST http://localhost:8080/api/redeem/request
```

**Response:** RedemptionRequest object

---

### 11. Start SIP Request
**POST** `/api/sip/request`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "fundName": "ICICI Value Fund",
  "amount": 2500,
  "frequency": "MONTHLY",
  "startDate": "2025-01-01"
}
```

**Minimal Body (frequency defaults to MONTHLY):**
```json
{
  "userId": 1,
  "schemeName": "ICICI Value Fund",
  "amount": 2500,
  "startDate": "2025-01-01"
}
```

**Example:**
```
POST http://localhost:8080/api/sip/request
```

**Response:** SIPRequest object

---

### 12. Save Nominee
**POST** `/api/nominee`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": 1,
  "nomineeName": "Jane Doe",
  "relationship": "Spouse",
  "dateOfBirth": "1990-05-15",
  "allocationPercentage": 100
}
```

**Example:**
```
POST http://localhost:8080/api/nominee
```

**Response:** Nominee object

---

### 13. Get All Requests (Investments, Redemptions, SIPs, Nominees)
**GET** `/api/dashboard/requests/{userId}`

**Example:**
```
GET http://localhost:8080/api/dashboard/requests/1
```

**Response:**
```json
{
  "investments": [...],
  "redemptions": [...],
  "sips": [...],
  "nominees": [...]
}
```

---

### 14. Get User Details
**GET** `/api/user/{userId}`

**Example:**
```
GET http://localhost:8080/api/user/1
```

**Response:**
```json
{
  "id": 1,
  "fullName": "Demo User",
  "username": "user1",
  "email": "demo1@ongolebulls.com",
  "mobileNumber": "9876543210"
}
```

---

## 📋 POSTMAN COLLECTION SETUP

### Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:8080`
- `userId`: `1`

### Headers (for all requests)
```
Content-Type: application/json
Accept: application/json
```

### Authentication
If your API requires authentication, add:
```
Authorization: Bearer <your-token>
```

---

## 🧪 TESTING CHECKLIST

### Dashboard Data
- [ ] GET `/api/dashboard/1` - Should return dashboard payload
- [ ] GET `/api/dashboard/1/asset-allocation` - Should return allocation data
- [ ] GET `/api/dashboard/1/profile` - Should return user profile
- [ ] PUT `/api/dashboard/1/profile` - Should update profile
- [ ] GET `/api/dashboard/1/transactions` - Should return transactions
- [ ] GET `/api/dashboard/1/metrics` - Should return metrics
- [ ] GET `/api/dashboard/1/recent-activity` - Should return activities
- [ ] POST `/api/dashboard/1/change-password` - Should change password

### Actions
- [ ] POST `/api/investments/request` - Should create investment request
- [ ] POST `/api/redeem/request` - Should create redemption request
- [ ] POST `/api/sip/request` - Should create SIP request
- [ ] POST `/api/nominee` - Should save nominee
- [ ] GET `/api/dashboard/requests/1` - Should return all requests
- [ ] GET `/api/user/1` - Should return user details

---

## 📝 NOTES

1. **Replace `{userId}`** with actual user ID (e.g., `1`, `2`, etc.)
2. **Date Format**: Use `YYYY-MM-DD` format for dates (e.g., `2025-01-01`)
3. **Frequency**: For SIP, use `"MONTHLY"` or `"WEEKLY"`
4. **Amount**: Use numbers (e.g., `10000`, `2500.50`)
5. **Error Handling**: All endpoints return appropriate HTTP status codes
6. **Empty Data**: Endpoints return empty arrays/objects if no data exists (no errors)

---

## 🔍 EXPECTED RESPONSES

### Success Response (200 OK)
```json
{
  "id": 1,
  "userId": 1,
  "fundName": "Axis Bluechip Fund",
  "amount": 10000,
  "status": "PENDING"
}
```

### Error Response (400/500)
```json
{
  "timestamp": "2025-01-01T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/investments/request"
}
```

---

## 🚀 QUICK TEST COMMANDS

### Test Dashboard Load
```bash
curl -X GET http://localhost:8080/api/dashboard/1
```

### Test Investment Request
```bash
curl -X POST http://localhost:8080/api/investments/request \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"fundName":"Test Fund","amount":1000}'
```

### Test SIP Request
```bash
curl -X POST http://localhost:8080/api/sip/request \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"fundName":"Test SIP","amount":2000,"frequency":"MONTHLY","startDate":"2025-01-01"}'
```

---

**Happy Testing! 🎉**

