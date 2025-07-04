# 🚀 Instrucciones Rápidas - Sistema de Depósito Mobile

## 📱 Cómo Ejecutar la Aplicación

### 1. **Iniciar la aplicación:**
```bash
cd SistemaMobile
npm start
```

### 2. **En tu teléfono:**
- Instala **Expo Go** desde Google Play Store o App Store
- Escanea el código QR que aparece en la terminal
- ¡Listo! La app se abrirá en tu teléfono

## 🎯 Primeros Pasos

### 1. **Cargar Datos de Ejemplo**
- Al abrir la app, ve a la pestaña **"Productos"**
- Si no hay productos, verás un botón **"Cargar Datos de Ejemplo"**
- Tócalo para cargar productos y clientes de prueba

### 2. **Explorar las Funciones**
- **Productos**: Gestiona tu inventario
- **Clientes**: Registra clientes con nombre y CUIL
- **Ventas**: Crea ventas con productos y clientes
- **Stock**: Controla entradas y salidas de stock
- **Reportes**: Ve estadísticas mensuales

## 🛒 Cómo Crear una Venta

1. Ve a **"Ventas"**
2. Toca el botón **"+"**
3. Busca y selecciona un **cliente**
4. Selecciona **productos** y cantidades
5. Toca **"Guardar Venta"**

## 📊 Cómo Ver Reportes

1. Ve a **"Reportes"**
2. Verás automáticamente:
   - Resumen del mes actual
   - Productos más vendidos
   - Mejores clientes
   - Productos con stock bajo

## ⚠️ Solución de Problemas

### Si la app no carga:
- Verifica que estés conectado a la misma red WiFi que tu PC
- Reinicia Expo Go
- Ejecuta `npm start` nuevamente

### Si hay errores:
- Cierra la app y ábrela de nuevo
- Verifica que todas las dependencias estén instaladas

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Verificar errores de TypeScript
npx tsc --noEmit

# Limpiar cache
npx expo start --clear

# Ejecutar en modo desarrollo
npm start
```

## 📞 Soporte

Si tienes problemas:
1. Revisa que estés en el directorio correcto (`SistemaMobile`)
2. Verifica que Node.js esté instalado
3. Asegúrate de tener Expo CLI instalado

---

**¡Disfruta usando tu Sistema de Depósito Mobile! 🎉** 