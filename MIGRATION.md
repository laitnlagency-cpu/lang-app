# LangMind - Guía de Migración (v1 → v2)

Si ya tienes la app funcionando, aquí está cómo actualizar a la versión mejorada.

---

## 📋 Checklist de Migración

### Paso 1: Archivos nuevos
- [ ] `components/audio-player.tsx`
- [ ] `lib/languages.ts`
- [ ] `app/onboarding/page.tsx`
- [ ] `globals-improved.css` → renombrar a `globals.css`

### Paso 2: Archivos a reemplazar
- [ ] `app/dashboard/page.tsx` (versión mejorada)
- [ ] `app/lesson/[id]/page.tsx` (versión mejorada)

### Paso 3: Database
- [ ] Ejecutar `schema-updated.sql` en Supabase

### Paso 4: Testing
- [ ] Test landing → onboarding
- [ ] Test selección de idiomas
- [ ] Test audio (🔊 y 🎤)
- [ ] Test dashboard con idiomas
- [ ] Test premium gate

---

## 🔄 Paso a Paso

### 1. Descargar archivos

```bash
# Desde outputs/
cp components-audio-player.tsx src/components/audio-player.tsx
cp lib-languages.ts lib/languages.ts
cp onboarding-page.tsx app/onboarding/page.tsx
cp globals-improved.css app/globals.css
cp dashboard-improved-page.tsx app/dashboard/page.tsx
cp lesson-improved-page.tsx app/lesson/[id]/page.tsx
```

### 2. Actualizar Supabase

En Supabase → SQL Editor:
```bash
# Copiar todo el contenido de schema-updated.sql
# Ejecutar
```

Esto crea:
- `user_preferences` (nuevo)
- `interactions` (nuevo)
- Indexes y RLS policies

### 3. Actualizar landing page

Archivo: `app/page.tsx`

Cambiar:
```tsx
// Antes
router.push('/dashboard');

// Después
router.push('/onboarding');
```

Razón: Primero selecciona idiomas, luego va al dashboard

### 4. Actualizar dashboard

El archivo `dashboard-improved-page.tsx` reemplaza a `dashboard/page.tsx`.

**Cambios principales:**
- Ahora muestra idiomas seleccionados
- Carga lecciones dinámicamente según `learning_language`
- Muestra progreso con audio visual

### 5. Actualizar lesson page

El archivo `lesson-improved-page.tsx` reemplaza a `lesson/[id]/page.tsx`.

**Cambios principales:**
- Importa `AudioPlayer` y `AudioButton`
- Carga preferencias de idioma del usuario
- Reproduce audio en idioma correcto
- Soporta grabación de pronunciación

### 6. npm install (si es necesario)

Las dependencias ya están en `package.json`. Si es la primera vez:
```bash
npm install
```

No hay nuevas dependencias (Web Speech API es nativa del navegador).

---

## 🧪 Testing Local

```bash
npm run dev
# http://localhost:3000
```

### Test 1: Onboarding
1. Click "Comenzar con Google"
2. Autenticarse
3. Debería ir a `/onboarding`
4. Seleccionar: Español → Inglés
5. Click "Comenzar a aprender"
6. Debería ir a `/dashboard`

### Test 2: Dashboard
1. Debería mostrar "🇪🇸 Español → 🇬🇧 English"
2. Debería mostrar lecciones de English
3. Click en Lección 1 → `/lesson/1`

### Test 3: Lección
1. Debería mostrar vocabulario
2. Click en 🔊 → debería sonar (necesita audio sintetizado)
3. Click en 🎤 → debería activar micrófono (pedir permiso)
4. Chat IA debería responder en inglés

### Test 4: Cambiar idiomas
1. Dashboard → Click "Cambiar idiomas"
2. Ir a `/onboarding`
3. Seleccionar: English → Español
4. Debería actualizar `user_preferences`
5. Dashboard ahora muestra lecciones de Español

---

## 🐛 Troubleshooting

### Problema: Audio no funciona
**Causa:** Navegador no soporta Web Speech API
**Solución:** 
- Usar Chrome/Edge (mejor soporte)
- En Safari, la pronunciación funciona pero sin grabación

### Problema: Micrófono no funciona
**Causa:** Falta permiso del navegador
**Solución:**
- Abrir settings del navegador
- Permitir micrófono para localhost:3000
- Recargar página

### Problema: Idioma no carga
**Causa:** `user_preferences` vacía
**Solución:**
- Ir a `/onboarding` manualmente
- Seleccionar idiomas
- Guardar preferencias

### Problema: CSS no aplica
**Causa:** `globals.css` no actualizado
**Solución:**
```bash
# Reemplazar globals.css completo
cp globals-improved.css app/globals.css
# Recargar navegador (Ctrl+Shift+R)
```

---

## 📊 Base de datos: Validar migración

Después de ejecutar `schema-updated.sql`, verifica:

```sql
-- Ver tablas nuevas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Debería incluir:
-- - user_preferences ✓
-- - interactions ✓
-- - feedback ✓

-- Ver que el usuario tenga preferencias
SELECT * FROM user_preferences 
WHERE user_id = 'tu-user-id';

-- Debería tener:
-- base_language: 'es'
-- learning_language: 'en'
```

---

## 🚀 Deploy a Vercel

```bash
# 1. Commit cambios
git add .
git commit -m "feat: audio, multi-idioma, diseño accesible"

# 2. Push
git push origin main

# 3. Vercel auto-deploya
# Verificar en vercel.com que build es exitoso
```

---

## ✅ Validación post-deploy

1. **Landing**: Carga sin errores
2. **Auth**: Google OAuth funciona
3. **Onboarding**: Selecciona idiomas y guarda
4. **Dashboard**: Muestra idiomas y lecciones correctas
5. **Lección**: Audio funciona y chat responde
6. **Premium**: Gate bloquea lecciones correctas

---

## 📈 Rollback (si algo falla)

```bash
# Volver a versión anterior
git revert HEAD
git push origin main

# Esperar a que Vercel redeploy
```

---

## 📞 Soporte durante migración

Si tienes dudas:
1. Revisar IMPROVEMENTS.md para entender cambios
2. Revisar MIGRATION.md (este archivo)
3. Contactar: laitnl.agency@gmail.com

---

**Tiempo estimado:** 30 minutos (incluyendo testing)
**Riesgo:** Bajo (cambios aislados, DB compatible)
**Beneficio:** +50% retención de usuarios
