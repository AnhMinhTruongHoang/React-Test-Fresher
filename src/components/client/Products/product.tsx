import { getBookByIdApi } from "@/components/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "./productDetail";
import BookLoader from "./loaderSkeleton";

const BookPage = () => {
  let { id } = useParams();
  const { notification } = App.useApp();
  const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchBookById = async () => {
        setIsLoading(true);
        const res = await getBookByIdApi(id);
        if (res && res.data) {
          setCurrentBook(res.data);
        } else {
          notification.error({
            message: " Product not found",
            description: res.message,
          });
        }
        setIsLoading(false);
      };
      fetchBookById();
    }
  }, [id]);
  return (
    ///////////loading skeleton
    <div>
      {isLoading ? <BookLoader /> : <BookDetail currentBook={currentBook} />}
    </div>
  );
};

export default BookPage;
