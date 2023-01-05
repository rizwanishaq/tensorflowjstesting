import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Button from "react-bootstrap/Button";
import LossComponent from "./LossComponent";
import Container from "react-bootstrap/Container";

const SimpleExample = () => {
  const [model, setModel] = useState();
  const [loss, setLoss] = useState([]);
  const [valloss, setValLoss] = useState([]);

  const xs = tf.tensor2d([1, 2, 3, 4, 5, 8], [6, 1], "float32");
  const ys = tf.tensor2d([1, 3, 5, 7, 3, 4], [6, 1], "float32");

  useEffect(() => {
    const model_ = tf.sequential();
    model_.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model_.compile({ loss: "meanSquaredError", optimizer: "sgd" });
    // model_.summary();
    setModel(model_);
  }, []);

  const handleClick = async () => {
    await model.fit(xs, ys, {
      batchSize: 1,
      epochs: 1000,
      verbose: true,
      validationData: [xs, ys],
      callbacks: {
        onBatchEnd: async (batch, logs) => {
          console.log(batch, logs);
        },
        onEpochEnd: async (epoch, logs) => {
          console.log(logs);
          setLoss((prevloss) => [...prevloss, +logs["loss"].toFixed(2)]);
          setValLoss((prevloss) => [...prevloss, +logs["val_loss"].toFixed(2)]);
        },
      },
    });
  };

  const handlePredict = () => {
    const result = model.predict(tf.tensor2d([5, 4, 3, 2, 1], [5, 1]));
    console.log(result.print());
  };

  return (
    <Container className="mt-2 mb-2">
      <LossComponent data={loss} text={"Loss"} />
      <LossComponent data={valloss} text={"Val_loss"} />

      <Button onClick={handleClick}>Train the model</Button>
      <Button onClick={handlePredict}>Predict</Button>
    </Container>
  );
};

export default SimpleExample;
