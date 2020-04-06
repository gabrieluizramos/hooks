import { useState, useEffect } from 'react';

import { keys, code } from './config';

const useKonamiCode = callback => {
    const [active, setActive] = useState(false);
    let progress = 0;

    const calculateKonami = ({ keyCode }) => {
        const nextKey = code[progress];
        const nextKeyCode = keys[nextKey];
        progress = nextKeyCode === keyCode ? progress + 1 : 0;
        
        const completed = progress === code.length;
        setActive(completed);
    };

    useEffect(() => {
        if(active) {
            callback();
            setActive(false);
        }
    }, [active]);

    useEffect(() => {
        window.addEventListener('keydown', calculateKonami);

        return () => window.addEventListener('keydown', calculateKonami);
    }, []);

    return { active };
};

export default useKonamiCode;