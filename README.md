# RuangDokter V1 Core V8

Offline-first clinical workspace prototype for doctors on duty.

## Current slice
- Active / Archive patient list
- New patient opens directly into consultation form
- Pediatric fields appear automatically for age < 18 years
- Pediatric age supports years / months / days
- Weight is only shown for pediatric patients; no estimated weight
- Structured vitals: SBP / DBP / HR / RR / temperature / SpO2 / O2
- Consultation output with smart omission of unavailable fields
- Copy All / Copy S / O / A / P
- Consultation tracking: contacted + advice received
- Patient completion / archive
- Patient detail with clinical snapshot (MAP, Shock Index)
- Timeline foundation
- Basic Tools page
- Local template foundation
- IndexedDB storage
- JSON backup / restore
- PWA service worker foundation

## Next
1. Refine UX after real workflow testing.
2. Build proper timeline/update events.
3. Expand deterministic clinical calculation engine.
4. Template engine aktif: template pasien dapat dipilih dan digunakan untuk Copy Konsul.
5. Build pediatric clinical tools and source-linked drug database.
6. Add configurable shifts and shift review.

## V1 Core V8 — Update & Timeline

Tahap ini menambahkan update klinis berbasis event:
- TTV/GCS terbaru
- Assessment
- Terapi / plan
- Lab / penunjang
- Catatan

Setiap update disimpan di `timeline` pasien. TTV dan GCS memperbarui sumber data klinis pasien sehingga SOAP, konsultasi, dan tools membaca nilai terbaru yang sama.
