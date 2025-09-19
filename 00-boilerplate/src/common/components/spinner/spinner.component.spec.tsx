import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SpinnerComponent } from './spinner.component';

// Mock de react-promise-tracker
vi.mock('react-promise-tracker', () => ({
  usePromiseTracker: vi.fn(),
}));

// Mock de react-spinners para simular el loader con texto "Loading..."
vi.mock('react-spinners/ScaleLoader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock de los estilos para no tener que importarlos en el test
vi.mock('./spinner.styles', () => ({
  modal: 'modal-class',
  loaderContainer: 'loader-container-class',
}));


describe('SpinnerComponent specs', () => {

  // Testea si el spinner se muestra cuando hay promesas activas
  it('should show spinner when promise is in progress', async () => {
    // Arrange: Si hay promesa activa el spinner se debería mostrar
    const { usePromiseTracker } = await import('react-promise-tracker');
    vi.mocked(usePromiseTracker).mockReturnValue({ promiseInProgress: true });
    console.log('Mock de promesa activa = true');

    // Act: Renderiza el componente
    render(<SpinnerComponent />);
    console.log('Componente spinnete renderizado');

    // Assert: Verificamos que el spinner esté visible
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    console.log('Spinner visible cuando hay promesa activa');
    console.log('Test OK!');
  });


  // Testea si el spinner NO se muestra cuando NO hay promesas activas
  it('should not show spinner when no promise is in progress', async () => {
    // Arrange: Si no hay promesa activa el spinner no se debe mostrar
    const { usePromiseTracker } = await import('react-promise-tracker');
    vi.mocked(usePromiseTracker).mockReturnValue({ promiseInProgress: false });
    console.log('Mock de promesa activa = false');

    // Act: Renderiza el componente
    render(<SpinnerComponent />);
    console.log('Componente spinnete renderizado');

    // Assert: Verificamos que el spinner NO esté visible
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    console.log('Spinner NO visible cuando no hay promesas');
    console.log('Test OK!');
  });


  // Ver si el loader es accesible cuando está visible (con texto "Loading...")
  it('should be accessible when loader is visible', async () => {
    // Arrange: Si hay promesa activa el loader se debe mostrar
    const { usePromiseTracker } = await import('react-promise-tracker');
    vi.mocked(usePromiseTracker).mockReturnValue({
      promiseInProgress: true,
    });
    console.log('Mock de promesa activa = true');

    // Act: Renderiza el componente
    render(<SpinnerComponent />);
    console.log('Spinner renderizado para test de accesibilidad');

    // Assert: Verificamos que el loader esté presente y sea accesible (muestre el texto "Loading...")
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveTextContent('Loading...');
    console.log('Loader accesible con texto "Loading..." verificado');

    // Verificamos que el loader tenga contenido accesible
    expect(loader).toBeVisible();
    console.log('Loader visible y accesible');
  });


});
