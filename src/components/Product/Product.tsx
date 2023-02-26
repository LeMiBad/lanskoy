import { useStore } from "effector-react"
import styled from "styled-components"
import usePage from "../../hooks/usePage"
import useProductImages from "../../hooks/useImages"
import { $acces } from "../../store/skladData"
import { IProduct } from "../../types/types"
import LoadImage from "../Ui/LoadImage/LoadImage"
import {productUpdate} from './../../store/ProductPage'
import NotImage from "./NotImage"
import { addBasketItem } from "../../store/basket"
import Tost from "./Tost"
import useTost from "../../hooks/useTost"
import useValute from "../../hooks/useValute"
import { Dispatch, SetStateAction, useEffect } from "react"




interface ProductItemProps {
    data: IProduct
    setImgLoading: Dispatch<SetStateAction<boolean>>
}


const StyledProductItem = styled.div`
    display: flex;
    width: 43vw;
    flex-direction: column;
    height: 100%;
    box-shadow: 8px 8px 11px #00000040;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`

const StyledProductImg = styled.img`
    height: 43vw;
    cursor: pointer;
    background-size: contain !important;
`

const StyledNameWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #e19946;
    padding: 10px 10px 15px 10px;
    color: white;
    .price {
        position: absolute;
        left: 10px;
        top: 10px;
    }
    h3 {
        font-size: 12px;
        font-weight: normal;
        max-width: 100%;
    }
    button {
        position: absolute;
        cursor: pointer;
        z-index: 1;
        right: 5%;
        top: -15px;
        font-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        padding: 4px 6px;
        background-color: rgb(242,18,71);
        color: white;
        border: 0;
        transition: 0.2s;
    }
    button:hover {
        background-color: #f87493;
    }
`


const Product: React.FC<ProductItemProps> = ({data, setImgLoading}) => {
    const {images, isLoading} = useProductImages(data)
    const {toProductPage} = usePage() 
    const {access_token} = useStore($acces)
    const {tost, setTost} = useTost()
    // const valute = useValute(data)

    useEffect(() => {
        if(isLoading) setImgLoading(true)
        else setImgLoading(false)
    }, [isLoading])

    const addBasketItemHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: IProduct) => {
        addBasketItem(
            {
                data: product,
                counter: 0
            }
        )
        const el = e.currentTarget
        setTimeout(() => {
            el.classList.add('buttonClick')
        }, 0)
        setTimeout(() => {
            el.classList.remove('buttonClick')
        }, 300)
    }

    const plusButtonHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: IProduct) => {
        if(product.variantsCount) toProductPage()
        else {
            addBasketItemHandler(e, product); 
            setTost([...tost, product.name])
        }
    }

    return (
        <>
            {tost.map((tost, i) => tost.length? <Tost key={i}>{tost}</Tost> : null)}
            {
                <StyledProductItem onClick={() => productUpdate({acces: access_token, product: data})}>
                    {
                        isLoading? <div onClick={toProductPage} style={{width: '43vw', height: '43vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><LoadImage/></div>
                        : 
                        images.length? 
                        <StyledProductImg src={images[0]} onClick={toProductPage}/>
                        : 
                        <NotImage onClick={toProductPage}/>
                    }            
                    <StyledNameWrapper>
                        <button onClick={(e) => plusButtonHandler(e, data)}>+</button>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                            <h3>{data.name}</h3>
                            {data.variantsCount? null : <h3 style={{fontSize: 16, fontWeight: 500}}>{data.buyPrice.value} {'руб'}</h3>}
                        </div>
                    </StyledNameWrapper>
                </StyledProductItem> 
            }
        </>
    )
}

export default Product