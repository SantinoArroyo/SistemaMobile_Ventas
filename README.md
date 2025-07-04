# Sistema de Depósito Mobile

Una aplicación móvil completa para la gestión de depósito, control de stock y registro de ventas mensuales con información de clientes (nombre y CUIL).

## 🚀 Características

### 📦 Gestión de Productos
- Agregar, editar y eliminar productos
- Control de stock y stock mínimo
- Categorización de productos
- Búsqueda y filtrado

### 👥 Gestión de Clientes
- Registro de clientes con nombre y CUIL
- Información adicional (teléfono, email, dirección)
- Búsqueda por nombre o CUIL

### 🛒 Registro de Ventas
- Crear ventas con múltiples productos
- Selección de cliente existente
- Cálculo automático de totales
- Registro de fecha y mes para reportes

### 📊 Control de Stock
- Movimientos de entrada y salida de stock
- Registro de motivos de movimientos
- Alertas de stock bajo
- Historial de movimientos

### 📈 Reportes Mensuales
- Resumen de ventas por mes
- Productos más vendidos
- Mejores clientes
- Alertas de productos con stock bajo
- Total de ventas y clientes únicos

## 🛠️ Tecnologías Utilizadas

- **React Native** con Expo
- **TypeScript** para tipado estático
- **Redux Toolkit** para gestión de estado
- **React Native Paper** para UI/UX
- **Expo SQLite** para base de datos local
- **React Navigation** para navegación

## 📱 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI (`npm install -g @expo/cli`)

### Pasos de Instalación

1. **Clonar el proyecto**
   ```bash
   cd SistemaMobile
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación**
   ```bash
   # Para Android
   npm run android
   
   # Para iOS (requiere macOS)
   npm run ios
   
   # Para desarrollo web
   npm run web
   ```

## 📋 Uso de la Aplicación

### 1. Gestión de Productos
- **Agregar Producto**: Toca el botón "+" y completa los campos obligatorios
- **Editar Producto**: Toca "Editar" en cualquier producto
- **Eliminar Producto**: Toca "Eliminar" y confirma
- **Buscar**: Usa la barra de búsqueda para filtrar productos

### 2. Gestión de Clientes
- **Agregar Cliente**: Toca el botón "+" y completa nombre y CUIL
- **Editar Cliente**: Toca "Editar" en cualquier cliente
- **Eliminar Cliente**: Toca "Eliminar" y confirma
- **Buscar**: Busca por nombre o CUIL

### 3. Registro de Ventas
- **Nueva Venta**: Toca el botón "+" en la pestaña Ventas
- **Seleccionar Cliente**: Busca y selecciona un cliente existente
- **Agregar Productos**: Selecciona productos y cantidades
- **Guardar Venta**: Confirma la venta

### 4. Control de Stock
- **Movimiento de Stock**: Toca "Movimiento" en cualquier producto
- **Entrada/Salida**: Selecciona el tipo de movimiento
- **Cantidad y Motivo**: Completa los detalles
- **Confirmar**: Guarda el movimiento

### 5. Reportes
- **Vista Mensual**: Los reportes se muestran automáticamente para el mes actual
- **Resumen**: Ve totales de ventas, clientes y productos
- **Rankings**: Top productos y clientes
- **Alertas**: Productos con stock bajo

## 🗄️ Estructura de Base de Datos

La aplicación utiliza SQLite local con las siguientes tablas:

- **products**: Información de productos
- **customers**: Datos de clientes
- **sales**: Registro de ventas
- **sale_items**: Items de cada venta
- **stock_movements**: Movimientos de stock

## 🔧 Configuración

### Variables de Entorno
No se requieren variables de entorno para el funcionamiento local.

### Personalización
- Colores: Modifica los estilos en los archivos de componentes
- Categorías: Agrega categorías personalizadas en la gestión de productos
- Campos: Extiende los tipos en `src/types/index.ts`

## 📱 Compatibilidad

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 12.0+
- **Web**: Navegadores modernos

## 🚀 Próximas Características

- [ ] Sincronización con Firebase
- [ ] Exportación de reportes a PDF
- [ ] Notificaciones push para stock bajo
- [ ] Modo offline mejorado
- [ ] Backup automático de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Contacta al desarrollador

---

**¡Disfruta usando tu Sistema de Depósito Mobile! 🎉** #   S i s t e m a M o b i l e _ V e n t a s  
 