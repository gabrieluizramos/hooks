import { renderHook, act } from '@testing-library/react-hooks'

import { keys, code } from '../use-konami-code/config';
import useKonamiCode from '../use-konami-code';

describe('useKonamiCode', () => {
    it('Should dispatch callback fn after typing correctly sequence of konami', () => {
        const callback = jest.fn();
        
        renderHook(() => useKonamiCode(callback));
        
        expect(callback).toHaveBeenCalledTimes(0);

        code.forEach(keyCode => act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: keys[keyCode] }));
        }));

        expect(callback).toHaveBeenCalledTimes(1);
    });
});