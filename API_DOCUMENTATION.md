# 📡 RUMUSKY AIRLINES — REST API Dokümantasyonu

Bu belge, RUMUSKY AIRLINES platformunun arka planında çalışan RESTful API uç noktalarını (endpoints), istek gövdelerini (request body) ve yanıt formatlarını açıklar.

---

## 1. Genel Prensipler & Yetkilendirme

- **Temel URL:** `/api/v1`
- **İçerik Türü:** `application/json`
- **Yetkilendirme:** `Authorization: Bearer <sanctum_token>`
- **Roller:** `super_admin`, `flight_manager`, `booking_manager`, `customer`

---

## 2. Uç Noktalar (Endpoints)

### 2.1 Uçuş Arama & Listeleme
* **`GET /api/flights/search`**
  * **Parametreler:**
    * `origin`: Havalimanı IATA kodu (Örn: `IST`)
    * `destination`: Havalimanı IATA kodu (Örn: `LHR`)
    * `departure_date`: YYYY-MM-DD
    * `return_date`: YYYY-MM-DD (İsteğe bağlı)
    * `cabin_class`: `economy` | `business`
  * **Yanıt (200 OK):**
    ```json
    [
      {
        "id": "fl-1",
        "flight_number": "RMK-101",
        "origin_iata": "IST",
        "destination_iata": "LHR",
        "departure_time": "2026-11-10T10:30:00",
        "arrival_time": "2026-11-10T12:45:00",
        "duration_minutes": 255,
        "price_economy": 2999,
        "price_business": 7499,
        "baggage_allowance_kg": 25,
        "operational_status": "Scheduled",
        "available_seats": 142
      }
    ]
    ```

* **`GET /api/flights/{id}`**
  * Uçuşun detaylarını, kabin olanaklarını ve tarife kurallarını döndürür.

---

### 2.2 Koltuk Envanteri & Geçici Kilit (Seat Hold)
* **`GET /api/flights/{id}/seats`**
  * Uçağın koltuk şablonunu ve anlık durumlarını (`available`, `held`, `booked`, `blocked`) döndürür.

* **`POST /api/flights/{id}/seats/hold`**
  * **İstek:**
    ```json
    {
      "seat_numbers": ["12A"],
      "session_id": "sess-902814"
    }
    ```
  * **İş Mantığı:** Koltuk 10 dakika boyunca `held` durumuna alınır. Süre dolunca otomatik serbest kalır.

---

### 2.3 Rezervasyon & Simüle Test Ödeme
* **`POST /api/bookings`**
  * **İstek:**
    ```json
    {
      "flight_id": "fl-1",
      "contact_email": "mustafa.gocuk@example.com",
      "contact_phone": "+905551234567",
      "passengers": [
        {
          "first_name": "Mustafa",
          "last_name": "Göçük",
          "gender": "M",
          "date_of_birth": "1995-05-15",
          "nationality": "TR",
          "id_or_passport_no": "12345678901",
          "seat_number": "12A",
          "cabin_class": "economy"
        }
      ],
      "extra_services": ["srv-fasttrack", "srv-baggage"]
    }
    ```
  * **Yanıt:**
    ```json
    {
      "pnr": "RMK84A",
      "status": "pending",
      "total_amount": 3579.00,
      "currency": "₺"
    }
    ```

* **`POST /api/bookings/{pnr}/pay`**
  * **İstek:** Test kart numarası, son kullanma, CVV.
  * **Yanıt:** Ödeme başarılı olursa bilet üretilir (`ticket_number`, `qr_code_hash`), koltuk `booked` durumuna geçer.

---

### 2.4 Rezervasyon Sorgulama & Check-in
* **`POST /api/bookings/lookup`**
  * **İstek:** `{"pnr": "RMK84A", "surname": "Göçük"}`
  * **Yanıt:** Rezervasyon dökümü, yolcular, koltuklar ve bilet numaraları.

* **`POST /api/check-in`**
  * **İstek:** `{"pnr": "RMK84A", "surname": "Göçük"}`
  * **Yanıt:** Biniş kartı onayı, kapı numarası ve barkod verisi.

---

### 2.5 Yönetici (Admin) Uç Noktaları
* **`POST /api/admin/flights`**: Yeni uçuş seferi planlama.
* **`PATCH /api/admin/flights/{id}/status`**: Sefer durumunu güncelleme (`Boarding`, `Departed`, `Delayed`, `Cancelled`).
* **`GET /api/admin/analytics`**: Toplam satış, doluluk ve gelir raporu.
* **`POST /api/admin/airports`**: Yeni havalimanı kaydı.
