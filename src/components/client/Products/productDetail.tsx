import { Row, Col, Rate, Divider, Button, Input, message } from "antd";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";
import { useCurrentApp } from "@/context/app.context";
import { Link } from "react-router-dom";

interface IProps {
  currentBook: IBookTable | null;
}

type UserAction = "MINUS" | "PLUS";

interface IProps {}
const BookDetail = (props: IProps) => {
  const { currentBook } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const refGallery = useRef<ImageGallery>(null);
  const [currentBookQuantity, setCurrentBookQuantity] = useState<number>(1);
  const { carts, setCarts } = useCurrentApp();
  const [imageGallery, setImageGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass: string;
      thumbnailClass: string;
    }[]
  >([]);

  useEffect(() => {
    if (currentBook) {
      const images = [];
      if (currentBook.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      }
      currentBook.slider?.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });
      currentBook.slider?.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });

      setImageGallery(images);
    }
  }, [currentBook]);

  ///////////////// add , minus button

  const handleChangeButton = (type: UserAction) => {
    if (type === "MINUS") {
      if (currentBookQuantity - 1 <= 0) return;
      setCurrentBookQuantity(currentBookQuantity - 1);
    }
    if (type === "PLUS" && currentBook) {
      if (currentBookQuantity === +currentBook.quantity) return;
      setCurrentBookQuantity(currentBookQuantity + 1);
    }
  };

  const handleChangeInput = (value: string) => {
    if (!isNaN(+value)) {
      if (+value > 0 && currentBook && +value < +currentBook.quantity) {
        setCurrentBookQuantity(+value);
      }
    }
  };
  //////////////////////// add to cart

  const handleAddToCart = () => {
    //update localStorage
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && currentBook) {
      //update
      const carts = JSON.parse(cartStorage) as ICart[];

      //check exist
      let isExistIndex = carts.findIndex((c) => c._id === currentBook?._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + currentBookQuantity;
      } else {
        carts.push({
          quantity: currentBookQuantity,
          _id: currentBook._id,
          detail: currentBook,
        });
      }

      localStorage.setItem("carts", JSON.stringify(carts));

      //sync React Context
      setCarts(carts);
    } else {
      //create
      const data = [
        {
          _id: currentBook?._id!,
          quantity: currentBookQuantity,
          detail: currentBook!,
        },
      ];
      localStorage.setItem("carts", JSON.stringify(data));

      //sync React Context
      setCarts(data);
    }
    message.success("Add Product Success !");
  };
  ///////////////////////////

  const handleOnClickImage = () => {
    //get current index onClick
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={imageGallery}
                showPlayButton={false} //hide play button
                showFullscreenButton={false} //hide fullscreen button
                renderLeftNav={() => <></>} //left arrow === <> </>
                renderRightNav={() => <></>} //right arrow === <> </>
                slideOnThumbnailOver={true} //onHover => auto scroll images
                onClick={() => handleOnClickImage()}
              />
            </Col>
            <Col md={14} sm={24}>
              <Col md={0} sm={24} xs={24}>
                <ImageGallery
                  ref={refGallery}
                  items={imageGallery}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  showThumbnails={false}
                />
              </Col>
              <Col span={24}>
                <div className="author">
                  Author:
                  <a href="#">
                    <i> {currentBook?.author} </i>
                  </a>
                </div>
                <div className="title">
                  <h2>{currentBook?.mainText}</h2>
                </div>
                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />
                  <span className="sold">
                    <Divider type="vertical" />
                    Sold: {currentBook?.sold}
                  </span>
                </div>
                <div className="price">
                  <span className="currency">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentBook?.price ?? 0)}
                  </span>
                </div>

                <div className="delivery">
                  <div>
                    <span className="left">Delivery Method:</span>
                    <span className="right" style={{ color: "greenyellow" }}>
                      <i>Free shipping</i>
                    </span>
                  </div>
                </div>
                <div className="quantity">
                  <span className="left">Quantity</span>
                  <span className="right">
                    <Button onClick={() => handleChangeButton("MINUS")}>
                      <MinusOutlined />
                    </Button>
                    <Input
                      onChange={(event) =>
                        handleChangeInput(event.target.value)
                      }
                      value={currentBookQuantity}
                    />
                    <Button onClick={() => handleChangeButton("PLUS")}>
                      <PlusOutlined />
                    </Button>
                  </span>
                </div>
                <div className="buy">
                  <button className="cart" onClick={() => handleAddToCart()}>
                    <BsCartPlus className="icon-cart" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="now">
                    <Link
                      to={"/OrderPageStep"}
                      onClick={() => handleAddToCart()}
                    >
                      Buy Now !
                    </Link>
                  </button>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={imageGallery}
        title={"hardcode"}
      />
    </div>
  );
};

export default BookDetail;
