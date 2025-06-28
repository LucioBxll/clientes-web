import { ref, nextTick, onMounted, onUnmounted } from 'vue';

/**
 * Composable para manejar scroll automático al final de un contenedor
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoScroll - Si debe hacer scroll automático
 * @param {number} options.threshold - Umbral para determinar si está cerca del final
 * @returns {Object} - Métodos y refs para manejar el scroll
 */
export function useScrollToBottom(options = {}) {
    const { autoScroll = true, threshold = 100 } = options;
    
    const containerRef = ref(null);
    const isNearBottom = ref(true);
    const isScrolling = ref(false);

    /**
     * Hace scroll al final del contenedor
     */
    const scrollToBottom = async (smooth = true) => {
        if (!containerRef.value) return;

        await nextTick();
        
        const container = containerRef.value;
        const scrollOptions = {
            top: container.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        };

        container.scrollTo(scrollOptions);
    };

    /**
     * Verifica si el usuario está cerca del final del contenedor
     */
    const checkIfNearBottom = () => {
        if (!containerRef.value) return;

        const container = containerRef.value;
        const { scrollTop, scrollHeight, clientHeight } = container;
        
        isNearBottom.value = scrollHeight - scrollTop - clientHeight < threshold;
    };

    /**
     * Maneja el evento de scroll
     */
    const handleScroll = () => {
        if (isScrolling.value) return;
        
        isScrolling.value = true;
        checkIfNearBottom();
        
        // Debounce para evitar demasiadas verificaciones
        setTimeout(() => {
            isScrolling.value = false;
        }, 100);
    };

    /**
     * Hace scroll automático solo si el usuario está cerca del final
     */
    const autoScrollIfNearBottom = async () => {
        if (autoScroll && isNearBottom.value) {
            await scrollToBottom(true);
        }
    };

    /**
     * Fuerza el scroll al final (ignora la posición del usuario)
     */
    const forceScrollToBottom = async () => {
        await scrollToBottom(true);
    };

    // Configurar event listeners
    onMounted(() => {
        if (containerRef.value) {
            containerRef.value.addEventListener('scroll', handleScroll);
            // Verificar posición inicial
            checkIfNearBottom();
        }
    });

    onUnmounted(() => {
        if (containerRef.value) {
            containerRef.value.removeEventListener('scroll', handleScroll);
        }
    });

    return {
        containerRef,
        isNearBottom,
        scrollToBottom,
        autoScrollIfNearBottom,
        forceScrollToBottom,
        checkIfNearBottom
    };
} 