import React from 'react'


interface ContainerProps {
    children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <main className='max-w-full lg:max-w-5xl mx-auto bg-white  relative'>
            {children}
        </main>
    )
}

export default Container