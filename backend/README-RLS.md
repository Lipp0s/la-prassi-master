# Supabase Row-Level Security (RLS) Policies

## Tabella: favorites

**Solo l’utente può vedere i propri preferiti:**
```sql
CREATE POLICY "Select own favorites" ON favorites
FOR SELECT USING (user_id = auth.uid());
```

**Solo l’utente può inserire/rimuovere i propri preferiti:**
```sql
CREATE POLICY "Insert own favorites" ON favorites
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Delete own favorites" ON favorites
FOR DELETE USING (user_id = auth.uid());
```

---

## Tabella: reviews

**Solo l’utente può vedere le proprie recensioni:**
```sql
CREATE POLICY "Select own reviews" ON reviews
FOR SELECT USING (user_id = auth.uid());
```

**Solo l’utente può inserire/rimuovere le proprie recensioni:**
```sql
CREATE POLICY "Insert own reviews" ON reviews
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Delete own reviews" ON reviews
FOR DELETE USING (user_id = auth.uid());
```

---

**Ricorda:**
- Attiva RLS su ogni tabella da Supabase Dashboard.
- Le policy vanno aggiunte nella sezione "RLS" della tabella.
- Puoi personalizzare le policy per admin/moderatori se necessario. 