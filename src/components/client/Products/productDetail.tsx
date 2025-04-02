import { Row, Col, Rate, Divider, Button, Input } from "antd";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import "styles/book.scss";
import ModalGallery from "./modal.gallery";

interface IProps {
  currentBook: IBookTable | null;
}

interface IProps {}
const BookDetail = (props: IProps) => {
  const { currentBook } = props;

  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const refGallery = useRef<ImageGallery>(null);
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
                    <Button>
                      <MinusOutlined />
                    </Button>
                    <Input defaultValue={1} />
                    <Button>
                      <PlusOutlined />
                    </Button>
                  </span>
                </div>
                <div className="buy">
                  <button className="cart">
                    <BsCartPlus className="icon-cart" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="now">Buy Now !</button>
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
