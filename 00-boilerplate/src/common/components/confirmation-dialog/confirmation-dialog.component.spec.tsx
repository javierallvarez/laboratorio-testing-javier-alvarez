import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

// Dentro de describe, incluimos tests usando toBeInTheDocument, not.toBeInTheDocument
describe('ConfirmationDialogComponent', () => {

  // Ver si se renderiza el dialog con title y botones
  it('should render dialog with title and buttons', () => {
    // Arrange: Declaramos props
    const props = {
      isOpen: true,
      onAccept: () => {},
      onClose: () => {},
      title: 'Test Title',
      labels: {
        closeButton: 'Cancel',
        acceptButton: 'Accept',
      },
      children: <div>Test content</div>,
    };

    // Act: Renderizamos el componente con isOpen true en las props
    render(<ConfirmationDialogComponent {...props} />);
    console.log('...props:', JSON.stringify(props));

    // Assert: Vemos que el componente se renderice correctamente con el title y los botonicos
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    console.log('Test OK!');
  });


  // Ver si no se renderiza el dialog cuando isOpen es false
  it('should not render dialog when isOpen is false', () => {
    // Arrange: Declaramos props con isOpen false
    const props = {
      isOpen: false,
      onAccept: () => {},
      onClose: () => {},
      title: 'Test Title',
      labels: {
        closeButton: 'Cancel',
        acceptButton: 'Accept',
      },
      children: <div>Test content</div>,
    };

    // Act: Renderizamos el componente con isOpen false en las props
    render(<ConfirmationDialogComponent {...props} />);

    // Assert: Vemos que el diálogo no se renderice
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Accept')).not.toBeInTheDocument();
    console.log('El dialog no se renderiza 👌');
    console.log('Test OK!');
  });


  // Ver si los botones funcionan correctamente al hacer click
  it('should call onClose when cancel button is clicked and onAccept when accept button is clicked', () => {
    // Arrange: Declaramos  funciones de callback, en caso de que no se llamen, se inicializan a 0
    const mockOnClose = () => {};
    const mockOnAccept = () => {};
    let onCloseCalled = 0;
    let onAcceptCalled = 0;

    const mockOnCloseWithCounter = () => {
      onCloseCalled++;
      console.log(`onClose llamado: ${onCloseCalled}`);
      mockOnClose();
    };

    const mockOnAcceptWithCounter = () => {
      onAcceptCalled++;
      console.log(`onAccept llamado: ${onAcceptCalled}`);
      mockOnAccept();
    };

    const props = {
      isOpen: true,
      onAccept: mockOnAcceptWithCounter,
      onClose: mockOnCloseWithCounter,
      title: 'Test Title',
      labels: {
        closeButton: 'Cancel',
        acceptButton: 'Accept',
      },
      children: <div>Test content</div>,
    };

    // Act: Renderizamos el componente con el contador de llamadas en onAccept y onClose
    render(<ConfirmationDialogComponent {...props} />);

    // Assert: Verificamos que los botones estén presentes y que el contador de llamadas en onAccept y onClose aun sea 0
    const cancelButton = screen.getByText('Cancel');
    const acceptButton = screen.getByText('Accept');
    expect(cancelButton).toBeInTheDocument();
    expect(acceptButton).toBeInTheDocument();

    // Act: Hacemos click en el botón Cancel
    fireEvent.click(cancelButton);

    // Assert: Vemos que onClose se haya llamado y que onAccept no se haya llamado
    expect(onCloseCalled).toBe(1);
    expect(onAcceptCalled).toBe(0);
    console.log(`Cancel clickado: onClose=${onCloseCalled}, onAccept=${onAcceptCalled}`);

    // Act: Hacemos click en el botón Accept
    fireEvent.click(acceptButton);

    // Assert: Verificamos que onAccept y onClose se hayan llamado (onClose se llama también en handleAccept)
    expect(onAcceptCalled).toBe(1);
    expect(onCloseCalled).toBe(2);
    console.log(`Accept clickado: onClose=${onCloseCalled}, onAccept=${onAcceptCalled}`);
  });
});
