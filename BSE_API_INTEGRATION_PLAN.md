# BSE/AMFI/NSE API Integration Plan

## ✅ Current State
- Dashboard uses **static/dummy data** from database
- Fund NAV values stored in `Fund` table but not updated automatically
- Market indices (Nifty, Sensex) use mock data
- Portfolio `currentValue` is static

## 🎯 Integration Options

### Option 1: AMFI (Association of Mutual Funds in India) - **RECOMMENDED**
- **Free**: Yes (public data)
- **NAV Data**: Daily NAV for all mutual funds
- **Format**: CSV/TXT files published daily
- **URL**: `https://www.amfiindia.com/spages/NAVAll.txt`
- **Update Frequency**: Once daily (after market close ~6 PM IST)

### Option 2: BSE (Bombay Stock Exchange)
- **Free**: Limited (may require registration)
- **NAV Data**: Available via BSE API
- **Format**: REST API / CSV
- **Update Frequency**: Daily

### Option 3: NSE (National Stock Exchange)
- **Free**: Limited
- **NAV Data**: Available via NSE API
- **Format**: REST API
- **Update Frequency**: Daily

### Option 4: Third-Party Providers
- **Examples**: Zerodha Kite API, Upstox API, Alpha Vantage, Yahoo Finance
- **Cost**: May require subscription
- **Real-time**: Some offer real-time data

## 📋 Implementation Steps

### Step 1: Add Dependencies
Add to `pom.xml`:
```xml
<!-- For HTTP client -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>

<!-- For scheduled tasks -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
```

### Step 2: Create Market Data Service
- `MarketDataService.java` - Fetches NAV from AMFI/BSE
- `MarketDataScheduler.java` - Scheduled task to update daily
- `MarketDataController.java` - API endpoint for manual refresh

### Step 3: Update Fund Model
- Add fields: `schemeCode`, `amfiCode`, `lastUpdated`
- Map AMFI scheme codes to your funds

### Step 4: Update Portfolio Calculations
- Recalculate `PortfolioPosition.currentValue` based on latest NAV
- Update dashboard metrics automatically

### Step 5: Market Indices Integration
- Fetch Nifty/Sensex from NSE/BSE APIs
- Update every 30 seconds during market hours

## 🔧 Technical Implementation

### AMFI NAV Data Format
```
Scheme Code;ISIN Div Payout/ ISIN Growth;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
100001;INF209K01EJ8;INF209K01EK6;Aditya Birla Sun Life Banking & PSU Debt Fund-Regular Plan-Growth Option;123.4567;15-Jan-2025
```

### Key Components Needed:
1. **MarketDataService** - Parse AMFI CSV and update Fund table
2. **ScheduledTask** - Run daily at 6:30 PM IST
3. **PortfolioUpdateService** - Recalculate portfolio values
4. **MarketIndicesService** - Fetch Nifty/Sensex (can use NSE API or third-party)

## ⚠️ Important Considerations

1. **Rate Limiting**: AMFI allows reasonable requests, but avoid excessive polling
2. **Error Handling**: Handle API failures gracefully, use cached data as fallback
3. **Data Mapping**: Map AMFI scheme codes to your internal fund IDs
4. **Market Hours**: NAV updates only after market close (~6 PM IST)
5. **Weekends/Holidays**: Skip updates on non-trading days

## 🚀 Quick Start (AMFI Integration)

1. **Enable Scheduling** in `OngoleBullsApplication.java`:
   ```java
   @EnableScheduling
   ```

2. **Create MarketDataService** to fetch and parse AMFI data

3. **Create Scheduled Task** to run daily:
   ```java
   @Scheduled(cron = "0 30 18 * * MON-FRI") // 6:30 PM IST, Mon-Fri
   public void updateNAVData() { ... }
   ```

4. **Update Frontend** to show "Last Updated" timestamp

## 📊 Benefits

- ✅ Real-time NAV values
- ✅ Accurate portfolio valuations
- ✅ Live market indices
- ✅ Better user experience
- ✅ Trustworthy data source

## 🔐 Security & Compliance

- Ensure compliance with data usage terms
- Store API credentials securely (environment variables)
- Implement proper error logging
- Cache data to reduce API calls
