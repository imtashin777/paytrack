# How Invoice Status Works

## Status Types

PayTrack has 3 invoice statuses:

1. **UNPAID** - Invoice hasn't been paid yet
2. **PAID** - Invoice has been marked as paid
3. **OVERDUE** - Invoice is unpaid AND past the due date

## How Status is Determined

### 1. When Invoice is Created
- All new invoices start as **UNPAID**
- Status is stored in the database as `UNPAID`

### 2. Auto-Calculating OVERDUE Status
Every time invoices are loaded, the system checks:
```javascript
if (invoice.status === "UNPAID" && invoice.dueDate < today) {
  status = "OVERDUE"
}
```

**Example:**
- Invoice created: January 1, 2025
- Due date: January 15, 2025
- Today: January 20, 2025
- Status: **OVERDUE** (because it's unpaid and past due date)

### 3. Marking as PAID
- User clicks "Mark as Paid" button
- Status changes to **PAID**
- `paidAt` timestamp is saved
- Status is stored in database as `PAID`

### 4. Status Display
- **UNPAID** = Yellow badge
- **PAID** = Green badge  
- **OVERDUE** = Red badge

## Where Status is Checked

1. **Dashboard** - Shows counts of unpaid/overdue/paid invoices
2. **Invoices List** - Shows status badge for each invoice
3. **Invoice Detail Page** - Shows full status information
4. **Auto-calculation** - Happens in `lib/actions/invoices.ts` in `getInvoices()` function

## Important Notes

- **OVERDUE is calculated, not stored** - It's computed on-the-fly when loading invoices
- **PAID is permanent** - Once marked as paid, it stays paid (unless manually changed in database)
- **Due date comparison** - Uses current date/time to check if invoice is overdue




