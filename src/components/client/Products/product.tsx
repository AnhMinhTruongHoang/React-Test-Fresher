import { getBookByIdApi } from "@/components/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "./productDetail";

const BookPage = () => {
  let { id } = useParams();
  const { notification } = App.useApp();
  const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBookById = async () => {
        const res = await getBookByIdApi(id);
        if (res && res.data) {
          setCurrentBook(res.data);
        } else {
          notification.error({
            message: " Product not found",
            description: res.message,
          });
        }
      };
      fetchBookById();
    }
  }, [id]);
  return (
    <div>
      <BookDetail currentBook={currentBook} />
    </div>
  );
};

export default BookPage;
